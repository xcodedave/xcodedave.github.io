
let ctx = null;
const buffers = {};
const rawData = {};
let musicSource = null;

function createCtx() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
}

function doDecode(name) {
    if (!ctx || !rawData[name] || buffers[name]) return;
    const ab = rawData[name].buffer.slice(0);
    ctx.decodeAudioData(ab,
        function(decoded) { buffers[name] = decoded; },
        function(err) { console.error('Audio decode error: ' + name, err); }
    );
}

// Resume/unlock audio on any user gesture (Safari requires this
// in the synchronous browser event handler, not in WASM callbacks)
['touchstart','touchend','mousedown','keydown'].forEach(function(e) {
    document.addEventListener(e, function() {
        createCtx();
        if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
            ctx.resume();
        }
        // Re-decode any buffers that failed while context was suspended
        for (var name in rawData) {
            if (!buffers[name]) doDecode(name);
        }
    }, {passive: true});
});

export function audio_register(name, data) {
    rawData[name] = new Uint8Array(data);
    createCtx();
    doDecode(name);
}

export function audio_play(name, volume, pitch, looping) {
    if (!ctx || ctx.state !== 'running' || !buffers[name]) return false;
    var src = ctx.createBufferSource();
    src.buffer = buffers[name];
    src.loop = looping;
    src.playbackRate.value = pitch;
    var gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
    if (looping) {
        if (musicSource) try { musicSource.stop(); } catch(e) {}
        musicSource = src;
    }
    return true;
}

export function audio_stop_music() {
    if (musicSource) {
        try { musicSource.stop(); } catch(e) {}
        musicSource = null;
    }
}
