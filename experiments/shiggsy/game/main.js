// --- added by update-game.sh (stamp 8156d969): cache busting ---
const __V = '8156d969';
const __realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const u = typeof input === 'string' ? input : input instanceof URL ? input.href : null;
  if (u && /(^|\/)assets\.pack(\?|$)/.test(u) && !/[?&]v=/.test(u)) {
    return __realFetch(u + (u.includes('?') ? '&' : '?') + 'v=' + __V, { ...init, cache: 'no-store' });
  }
  return __realFetch(input, init);
};
// --- end ---
// Loads the sm64-web wasm module (architecture.md §1, `web/` row). Built by scripts/build-web.sh.
import init, * as sm64 from './pkg/sm64_web.js?v=8156d969';
import { installAudio } from './audio.js?v=8156d969';

// The audio shell must exist before the wasm host starts: it pushes each tick's samples to it.
installAudio();
await init({ module_or_path: new URL('pkg/sm64_web_bg.wasm?v=8156d969', import.meta.url) });
// Picks the renderer (WebGPU if it works, else WebGL2; `?renderer=` forces one) and starts the app.
await sm64.boot();
window.sm64 = sm64;
window.__sm64Ready = true;
