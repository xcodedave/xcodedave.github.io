// The AudioWorklet half of the D6 counter-hypothesis (web/audio.js): a ring buffer of stereo
// float frames that the main thread fills with postMessage chunks (Int16, interleaved) and
// `process` drains 128 frames at a time. It waits for `lead` frames before it (re)starts playing
// (that is its latency), counts an underrun whenever it runs dry while playing, and drops a chunk
// that would overfill the ring (`max` frames). Statistics go back to the page twice a second.
class Ring extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = options.processorOptions;
    this.lead = o.lead;
    this.max = o.max;
    this.cap = 1 << 15;
    this.l = new Float32Array(this.cap);
    this.r = new Float32Array(this.cap);
    this.rd = 0;
    this.wr = 0; // frames: wr - rd is the fill
    this.playing = false;
    this.started = false;
    this.underruns = 0;
    this.dropped = 0;
    this.fillSum = 0;
    this.fillN = 0;
    this.fillMax = 0;
    this.blocks = 0;
    this.port.onmessage = (e) => this.onChunk(e.data);
  }

  onChunk(i16) {
    const n = i16.length >> 1;
    if (this.wr - this.rd + n > this.max) {
      this.dropped++;
      return;
    }
    const m = this.cap - 1;
    for (let i = 0, j = 0; i < n; i++, j += 2) {
      const k = (this.wr + i) & m;
      this.l[k] = i16[j] / 32768;
      this.r[k] = i16[j + 1] / 32768;
    }
    this.wr += n;
  }

  process(_inputs, outputs) {
    const out = outputs[0];
    const ol = out[0];
    const or = out[1];
    const n = ol.length;
    const fill = this.wr - this.rd;
    if (!this.playing && fill >= this.lead) {
      this.playing = true;
      this.started = true;
    }
    const m = this.cap - 1;
    if (this.playing) {
      const take = Math.min(n, fill);
      for (let i = 0; i < take; i++) {
        const k = (this.rd + i) & m;
        ol[i] = this.l[k];
        or[i] = this.r[k];
      }
      for (let i = take; i < n; i++) {
        ol[i] = 0;
        or[i] = 0;
      }
      this.rd += take;
      if (take < n) {
        this.underruns++;
        this.playing = false; // rebuffer
      }
    } else {
      ol.fill(0);
      or.fill(0);
    }
    const f = this.wr - this.rd;
    if (this.started) {
      this.fillSum += f;
      this.fillN++;
      if (f > this.fillMax) this.fillMax = f;
    }
    if (++this.blocks % 172 === 0) {
      this.port.postMessage({
        underruns: this.underruns,
        dropped: this.dropped,
        fill: f,
        fillSum: this.fillSum,
        fillN: this.fillN,
        fillMax: this.fillMax,
      });
    }
    return true;
  }
}

registerProcessor('sm64-ring', Ring);
