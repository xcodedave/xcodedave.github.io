// The audio shell (T5.3; architecture.md §7, decision D6). The game core produces interleaved
// stereo Int16 samples at 32006 Hz, about 1067 sample frames per game tick (crates/sm64-core/src/
// audio/thread.rs); the wasm host hands each tick's chunk to `window.__sm64Audio.push`.
//
// Two sinks sit behind the one interface (`push`, `stats`, `close`), chosen by `?audio=`:
//   buffers  (D6 pin)   scheduled AudioBufferSourceNodes
//   worklet  (counter)  an AudioWorklet with a ring buffer fed by postMessage
// The AudioContext is created at the context's own sample-rate = the game's rate (32006 Hz), so the
// browser resamples once, continuously, to the device rate (no per-buffer resampling seams).
//
// Autoplay policy: the context is created and resumed on the first user gesture (key, click,
// touch); samples pushed before that are dropped (a backlog would only add latency).
// Mute: `?mute=1` and the M key; a muted game keeps running and keeps feeding the sink.

const params = new URLSearchParams(location.search);
const KIND = params.get('audio') === 'worklet' ? 'worklet' : 'buffers';
/** Audio queued ahead of the playhead when a sink (re)starts, seconds (about 2 game ticks). */
const LEAD = 0.07;
/** Most audio a sink keeps queued; more is dropped (the page fell behind and caught up). */
const MAX_AHEAD = 0.14;

/** The scheduled-AudioBufferSourceNode sink (D6 pin). */
class BufferSink {
  constructor(ctx, out, rate) {
    this.ctx = ctx;
    this.out = out;
    this.rate = rate;
    this.next = 0; // context time at which the next chunk starts
    this.started = false;
    this.underruns = 0;
    this.dropped = 0;
    this.pushes = 0;
    this.leadSum = 0; // queued audio at each push, seconds
    this.leadMax = 0;
    this.pushMs = 0; // main-thread time inside push
  }

  push(i16) {
    const t0 = performance.now();
    const n = i16.length >> 1;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    if (this.next < now + 0.002) {
      // The playhead reached the end of what was queued (or nothing was queued yet).
      if (this.started) this.underruns++;
      this.started = true;
      this.next = now + LEAD;
    } else if (this.next - now > MAX_AHEAD) {
      this.dropped++;
      this.pushMs += performance.now() - t0;
      return;
    }
    const buf = ctx.createBuffer(2, n, this.rate);
    const l = buf.getChannelData(0);
    const r = buf.getChannelData(1);
    for (let i = 0, j = 0; i < n; i++, j += 2) {
      l[i] = i16[j] / 32768;
      r[i] = i16[j + 1] / 32768;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.out);
    src.start(this.next);
    const lead = this.next - now;
    this.leadSum += lead;
    if (lead > this.leadMax) this.leadMax = lead;
    this.pushes++;
    this.next += n / this.rate;
    this.pushMs += performance.now() - t0;
  }

  stats() {
    return {
      kind: 'buffers',
      underruns: this.underruns,
      dropped: this.dropped,
      pushes: this.pushes,
      meanQueuedMs: this.pushes ? (this.leadSum / this.pushes) * 1000 : 0,
      maxQueuedMs: this.leadMax * 1000,
      pushMsMean: this.pushes ? this.pushMs / this.pushes : 0,
    };
  }

  close() {}
}

/** The AudioWorklet + ring buffer sink (D6 counter-hypothesis). */
class WorkletSink {
  constructor(ctx, out, rate, node) {
    this.ctx = ctx;
    this.rate = rate;
    this.node = node;
    node.connect(out);
    this.remote = { underruns: 0, dropped: 0, fill: 0, fillSum: 0, fillN: 0, fillMax: 0, processMs: 0 };
    this.pushes = 0;
    this.pushMs = 0;
    node.port.onmessage = (e) => {
      this.remote = e.data;
    };
  }

  static async create(ctx, out, rate) {
    await ctx.audioWorklet.addModule(new URL('./audio-worklet.js?v=8156d969', import.meta.url));
    const node = new AudioWorkletNode(ctx, 'sm64-ring', {
      numberOfInputs: 0,
      outputChannelCount: [2],
      processorOptions: { lead: Math.round(LEAD * rate), max: Math.round(MAX_AHEAD * rate) },
    });
    return new WorkletSink(ctx, out, rate, node);
  }

  push(i16) {
    const t0 = performance.now();
    // Copy (the wasm side reuses nothing, but the Int16Array may be a view) and transfer.
    const copy = new Int16Array(i16);
    this.node.port.postMessage(copy, [copy.buffer]);
    this.pushes++;
    this.pushMs += performance.now() - t0;
  }

  stats() {
    const r = this.remote;
    return {
      kind: 'worklet',
      underruns: r.underruns,
      dropped: r.dropped,
      pushes: this.pushes,
      meanQueuedMs: r.fillN ? (r.fillSum / r.fillN / this.rate) * 1000 : 0,
      maxQueuedMs: (r.fillMax / this.rate) * 1000,
      pushMsMean: this.pushes ? this.pushMs / this.pushes : 0,
      workletBlocks: r.fillN,
    };
  }

  close() {
    this.node.disconnect();
  }
}

class AudioShell {
  constructor() {
    this.rate = 0;
    this.muted = params.get('mute') === '1';
    this.ctx = null;
    this.gain = null;
    this.analyser = null;
    this.sink = null;
    this.state = 'idle'; // idle | starting | running | failed
    this.error = null;
    this.beforeStart = 0; // samples pushed before the first gesture, dropped
    this.pushedSamples = 0; // sample frames handed to the sink
    this.t0 = 0;
    this.tap = { peak: 0, rms: 0, loudTicks: 0, ticks: 0, maxPeak: 0 };
    this.render = null; // AudioRenderCapacity events, where the browser has them
  }

  /** Called by the host once the game's sample rate is known. */
  configure(rate) {
    this.rate = rate;
    if (this.pendingGesture) this.start();
  }

  /** Called by the host after every game tick with that tick's chunk. */
  push(i16) {
    if (this.state === 'running' && this.sink) {
      if (!this.t0) this.t0 = performance.now();
      this.pushedSamples += i16.length >> 1;
      this.sink.push(i16);
    } else {
      this.beforeStart += i16.length >> 1;
    }
  }

  async start() {
    if (this.state !== 'idle') return;
    if (!this.rate) {
      this.pendingGesture = true;
      return;
    }
    this.state = 'starting';
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      let ctx;
      try {
        ctx = new Ctx({ sampleRate: this.rate, latencyHint: 'interactive' });
      } catch (_) {
        ctx = new Ctx({ latencyHint: 'interactive' }); // a rate the browser refuses
      }
      this.ctx = ctx;
      this.gain = ctx.createGain();
      this.gain.gain.value = this.muted ? 0 : 1;
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.gain.connect(this.analyser);
      this.analyser.connect(ctx.destination);
      this.sink =
        KIND === 'worklet'
          ? await WorkletSink.create(ctx, this.gain, this.rate)
          : new BufferSink(ctx, this.gain, this.rate);
      await ctx.resume();
      this.state = ctx.state === 'running' ? 'running' : 'idle';
      if (this.state === 'running') {
        this.startTap();
        if (ctx.renderCapacity) {
          this.render = { averageLoad: 0, peakLoad: 0, underrunRatio: 0, events: 0 };
          ctx.renderCapacity.addEventListener('update', (e) => {
            this.render.averageLoad = e.averageLoad;
            this.render.peakLoad = Math.max(this.render.peakLoad, e.peakLoad);
            this.render.underrunRatio = e.underrunRatio;
            this.render.events++;
          });
          ctx.renderCapacity.start({ updateInterval: 1 });
        }
      } else {
        // Still suspended (no user activation yet): try again on the next gesture.
        this.sink.close();
        ctx.close();
        this.ctx = this.sink = null;
      }
    } catch (e) {
      this.state = 'failed';
      this.error = String(e);
      console.error('sm64-audio: could not start: ' + this.error);
    }
  }

  startTap() {
    const buf = new Float32Array(this.analyser.fftSize);
    setInterval(() => {
      this.analyser.getFloatTimeDomainData(buf);
      let peak = 0;
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = Math.abs(buf[i]);
        if (v > peak) peak = v;
        sum += v * v;
      }
      const t = this.tap;
      t.peak = peak;
      t.rms = Math.sqrt(sum / buf.length);
      t.ticks++;
      if (peak > 0.002) t.loudTicks++;
      if (peak > t.maxPeak) t.maxPeak = peak;
    }, 50);
  }

  setMuted(m) {
    this.muted = !!m;
    if (this.gain) this.gain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.01);
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  stats() {
    const sink = this.sink ? this.sink.stats() : {};
    return {
      kind: KIND,
      state: this.state,
      error: this.error,
      muted: this.muted,
      rate: this.rate,
      contextRate: this.ctx ? this.ctx.sampleRate : 0,
      baseLatencyMs: this.ctx ? (this.ctx.baseLatency || 0) * 1000 : 0,
      outputLatencyMs: this.ctx ? (this.ctx.outputLatency || 0) * 1000 : 0,
      currentTime: this.ctx ? this.ctx.currentTime : 0,
      droppedBeforeStart: this.beforeStart,
      pushedSamples: this.pushedSamples,
      pushSeconds: this.t0 ? (performance.now() - this.t0) / 1000 : 0,
      tap: { ...this.tap },
      render: this.render ? { ...this.render } : null,
      ...sink,
    };
  }
}

export function installAudio() {
  const shell = new AudioShell();
  window.__sm64Audio = shell;
  window.__sm64AudioStats = () => shell.stats();
  const gesture = () => {
    shell.start().then(() => {
      if (shell.state === 'running') {
        for (const ev of ['keydown', 'pointerdown', 'touchstart', 'mousedown', 'click']) {
          window.removeEventListener(ev, gesture, true);
        }
      }
    });
  };
  for (const ev of ['keydown', 'pointerdown', 'touchstart', 'mousedown', 'click']) {
    window.addEventListener(ev, gesture, true);
  }
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.code === 'KeyM' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
        shell.toggleMute();
      }
    },
    true,
  );
  return shell;
}
