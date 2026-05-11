// Vanilla JS shell for the gjh-wasm `TilingSession`. No build system —
// just an ES module imported directly into the browser. The wasm bundle in
// ./pkg/ is produced by `wasm-pack build --target web` (see ../README.md).
//
// Layout: the canvas fills the whole viewport (full-page tiling); a floating
// panel in the top-left holds controls.

import init, { TilingSession } from "./pkg/gjh_wasm.js";

const RESET_ZOOM = 1.0;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 6.0;

// Default per-shape tile palette. Mirrors `default_palette()` in
// `crates/gjh-wasm/src/lib.rs` so the colour pickers match what the wasm
// session actually starts with.
const DEFAULT_TILE_PALETTE = {
  3: "#abc6d5",
  4: "#f0ebdc",
  6: "#cdaf8c",
  8: "#b49178",
  12: "#9b7864",
};
const FALLBACK_TILE_COLOR = "#dcdcdc";

const state = {
  panX: 0,
  panY: 0,
  zoom: RESET_ZOOM,
  configIdx: 52,
  angleDeg: 30,
  tileBandWidth: 4,
  starBandWidth: 4,
  showStars: true,
  showTiles: false,
  tileWeave: false,
  starWeave: true,
  harmonicSnap: true,
  // Sorted list of "harmonic" star-contact angles (in degrees) for the
  // currently loaded tiling: union of `k * 180/n` for each polygon edge
  // count n. Rebuilt on every config switch.
  harmonics: [],
  // Mutable colour state — initialised from the input defaults below.
  tilePalette: { ...DEFAULT_TILE_PALETTE },
  starFill: "#ebd7af",
  starStroke: "#c82020",
  interstitialFill: "#c8643c",
  tileStroke: "#202020",
  background: "#ffffff",
};

// --- URL-hash state codec --------------------------------------------------
//
// Encode `state` as URL-safe base64(JSON) and stamp it into `location.hash`
// after the user finishes interacting (debounced) so the URL becomes a
// shareable permalink. Tiling identity is stored as its index into
// `TilingSession.listConfigs()` (single-byte).

function urlSafeBtoa(s) {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function urlSafeAtob(s) {
  const padLen = (4 - (s.length % 4)) % 4;
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLen));
}

function encodeState(s) {
  // Compact key names to keep the URL short.
  const obj = {
    c: s.configIdx,
    a: s.angleDeg,
    tb: s.tileBandWidth,
    sb: s.starBandWidth,
    z: s.zoom,
    x: s.panX,
    y: s.panY,
    st: s.showTiles ? 1 : 0,
    ss: s.showStars ? 1 : 0,
    tw: s.tileWeave ? 1 : 0,
    sw: s.starWeave ? 1 : 0,
    hs: s.harmonicSnap ? 1 : 0,
    pal: s.tilePalette,
    sf: s.starFill,
    sk: s.starStroke,
    bw: s.interstitialFill,
    ts: s.tileStroke,
    bg: s.background,
  };
  return urlSafeBtoa(JSON.stringify(obj));
}

function decodeStateInto(s, encoded) {
  let obj;
  try {
    obj = JSON.parse(urlSafeAtob(encoded));
  } catch (_) {
    return false;
  }
  if (typeof obj !== "object" || obj === null) return false;
  if (Number.isInteger(obj.c)) s.configIdx = obj.c;
  if (typeof obj.a === "number") s.angleDeg = obj.a;
  // Per-layer band widths (new). Fall back to legacy `b` (one slider for
  // both layers) so old URL hashes keep working.
  if (typeof obj.tb === "number") s.tileBandWidth = obj.tb;
  else if (typeof obj.b === "number") s.tileBandWidth = obj.b;
  if (typeof obj.sb === "number") s.starBandWidth = obj.sb;
  else if (typeof obj.b === "number") s.starBandWidth = obj.b;
  if (typeof obj.z === "number") s.zoom = obj.z;
  if (typeof obj.x === "number") s.panX = obj.x;
  if (typeof obj.y === "number") s.panY = obj.y;
  if (obj.st !== undefined) s.showTiles = !!obj.st;
  if (obj.ss !== undefined) s.showStars = !!obj.ss;
  if (obj.tw !== undefined) s.tileWeave = !!obj.tw;
  if (obj.sw !== undefined) s.starWeave = !!obj.sw;
  if (obj.hs !== undefined) s.harmonicSnap = !!obj.hs;
  if (obj.pal && typeof obj.pal === "object") {
    s.tilePalette = { ...s.tilePalette, ...obj.pal };
  }
  if (typeof obj.sf === "string") s.starFill = obj.sf;
  if (typeof obj.sk === "string") s.starStroke = obj.sk;
  if (typeof obj.bw === "string") s.interstitialFill = obj.bw;
  if (typeof obj.ts === "string") s.tileStroke = obj.ts;
  if (typeof obj.bg === "string") s.background = obj.bg;
  return true;
}

function hexToRgb(hex) {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  const v = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h;
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

async function main() {
  await init();

  // Apply any state encoded in the URL hash *before* we wire up the session
  // and DOM, so dropdowns/sliders/colour pickers all start in the saved
  // state rather than briefly flashing the defaults.
  if (location.hash && location.hash.length > 1) {
    decodeStateInto(state, location.hash.slice(1));
  }

  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const select = document.getElementById("config-select");
  const randomBtn = document.getElementById("random");
  const angle = document.getElementById("angle");
  const angleReadout = document.getElementById("angle-readout");
  const tileBand = document.getElementById("tile-band");
  const tileBandReadout = document.getElementById("tile-band-readout");
  const starBand = document.getElementById("star-band");
  const starBandReadout = document.getElementById("star-band-readout");
  const zoomSlider = document.getElementById("zoom");
  const zoomReadout = document.getElementById("zoom-readout");
  const showStarsCb = document.getElementById("show-stars");
  const showTilesCb = document.getElementById("show-tiles");
  const tileWeaveCb = document.getElementById("tile-weave");
  const starWeaveCb = document.getElementById("star-weave");
  const harmonicSnapCb = document.getElementById("harmonic-snap");
  const resetBtn = document.getElementById("reset-view");
  const svgBtn = document.getElementById("export-svg");
  const pngBtn = document.getElementById("export-png");

  const tilePaletteContainer = document.getElementById("tile-palette");
  const starFillInput = document.getElementById("star-fill");
  const starStrokeInput = document.getElementById("star-stroke");
  const interstitialFillInput = document.getElementById("interstitial-fill");
  const tileStrokeInput = document.getElementById("tile-stroke");
  const backgroundInput = document.getElementById("background");

  // Apply the body background colour outside the canvas so the floating
  // panel sits on the same colour the canvas fills with.
  const applyBodyBackground = () => {
    document.body.style.background = state.background;
  };
  applyBodyBackground();

  // Populate config dropdown.
  const configs = TilingSession.listConfigs();
  for (let i = 0; i < configs.length; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = configs[i];
    select.appendChild(opt);
  }
  // Clamp in case a stale URL hash carries an out-of-range index.
  if (state.configIdx < 0 || state.configIdx >= configs.length) {
    state.configIdx = 0;
  }
  select.value = String(state.configIdx);

  const session = new TilingSession(state.configIdx);

  // Resize canvas to viewport for crisp drawing on HiDPI.
  const sizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const pushViewport = () => {
    session.setViewport(window.innerWidth, window.innerHeight, state.panX, state.panY, state.zoom);
  };

  const draw = () => {
    pushViewport();
    session.render(ctx);
  };

  const onResize = () => {
    sizeCanvas();
    draw();
  };
  window.addEventListener("resize", onResize);
  sizeCanvas();

  const updateZoomReadout = () => {
    zoomReadout.textContent = `${state.zoom.toFixed(2)}×`;
    zoomSlider.value = String(state.zoom);
  };

  const pushColors = () => {
    const sf = hexToRgb(state.starFill);
    const ss = hexToRgb(state.starStroke);
    const ts = hexToRgb(state.tileStroke);
    const bg = hexToRgb(state.background);
    const inter = hexToRgb(state.interstitialFill);
    session.setStarFillColor(sf[0], sf[1], sf[2]);
    session.setStarStrokeColor(ss[0], ss[1], ss[2]);
    session.setInterstitialFillColor(inter[0], inter[1], inter[2]);
    session.setTileStrokeColor(ts[0], ts[1], ts[2]);
    session.setBackground(bg[0], bg[1], bg[2]);
    for (const [n, hex] of Object.entries(state.tilePalette)) {
      const [r, g, b] = hexToRgb(hex);
      session.setTilePaletteColor(parseInt(n, 10), r, g, b);
    }
  };

  // Build colour pickers for the polygon shapes present in the current
  // tiling. Called on init and on every config switch — the set of shapes
  // can change (e.g. switching from `6/m30/r(h1)` to `12-3/m30/r(c2)`
  // adds a 12-gon picker).
  // "Harmonic" star-contact angles for the current tiling: union of
  // `k * 180/n` (in degrees, strictly between 0 and 90) for every polygon
  // edge-count n in the tiling. These are the contact angles at which
  // Hankin star edges most cleanly align with the polygon's symmetry axes.
  // Examples:
  //   triangle (n=3): {60}
  //   square   (n=4): {45}
  //   hexagon  (n=6): {30, 60}
  //   octagon  (n=8): {22.5, 45, 67.5}
  //   dodecagon(n=12): {15, 30, 45, 60, 75}
  const rebuildHarmonics = () => {
    const counts = Array.from(session.tileShapeEdgeCounts());
    const set = new Set();
    for (const n of counts) {
      if (n < 3) continue;
      const step = 180 / n;
      for (let k = 1; k * step < 90 - 1e-9; k++) {
        // Round to avoid floating-point drift in the Set dedup.
        set.add(Math.round(k * step * 1000) / 1000);
      }
    }
    state.harmonics = Array.from(set).sort((a, b) => a - b);
  };

  // Snap `deg` to the nearest harmonic if harmonic snap is enabled and the
  // nearest harmonic is within 4°. Otherwise return `deg` unchanged.
  const SNAP_THRESHOLD_DEG = 4;
  const snapAngle = (deg) => {
    if (!state.harmonicSnap || state.harmonics.length === 0) return deg;
    let best = deg;
    let bestD = SNAP_THRESHOLD_DEG;
    for (const h of state.harmonics) {
      const d = Math.abs(h - deg);
      if (d <= bestD) {
        bestD = d;
        best = h;
      }
    }
    return best;
  };

  const rebuildTilePalette = () => {
    tilePaletteContainer.innerHTML = "";
    const counts = Array.from(session.tileShapeEdgeCounts());
    counts.sort((a, b) => a - b);
    if (counts.length === 0) {
      tilePaletteContainer.innerHTML = '<span class="palette-title" style="color:#aaa">(none)</span>';
      return;
    }
    for (const n of counts) {
      const wrap = document.createElement("label");
      wrap.className = "swatch";
      const input = document.createElement("input");
      input.type = "color";
      const current = state.tilePalette[n] || FALLBACK_TILE_COLOR;
      input.value = current;
      // Persist any newly-added defaults so the next rebuild keeps them.
      state.tilePalette[n] = current;
      input.addEventListener("input", () => {
        state.tilePalette[n] = input.value;
        const [r, g, b] = hexToRgb(input.value);
        session.setTilePaletteColor(n, r, g, b);
        draw();
        scheduleHashUpdate();
      });
      const label = document.createElement("span");
      label.textContent = `${n}-gon`;
      wrap.appendChild(input);
      wrap.appendChild(label);
      tilePaletteContainer.appendChild(wrap);
    }
  };

  // Sync DOM input values from `state`. Called once on init (after the hash
  // has been decoded) and on `switchConfig` (which resets pan/zoom). All
  // input elements with persisted state are updated; their own `input` /
  // `change` handlers do *not* fire because we set `.value` / `.checked`
  // programmatically.
  const applyStateToDom = () => {
    select.value = String(state.configIdx);
    angle.value = String(state.angleDeg);
    angleReadout.textContent = Number.isInteger(state.angleDeg)
      ? `${state.angleDeg.toFixed(0)}°`
      : `${state.angleDeg.toFixed(1)}°`;
    tileBand.value = String(state.tileBandWidth);
    tileBandReadout.textContent = `${state.tileBandWidth.toFixed(1)} px`;
    starBand.value = String(state.starBandWidth);
    starBandReadout.textContent = `${state.starBandWidth.toFixed(1)} px`;
    zoomSlider.value = String(state.zoom);
    showStarsCb.checked = state.showStars;
    showTilesCb.checked = state.showTiles;
    tileWeaveCb.checked = state.tileWeave;
    starWeaveCb.checked = state.starWeave;
    harmonicSnapCb.checked = state.harmonicSnap;
    starFillInput.value = state.starFill;
    starStrokeInput.value = state.starStroke;
    interstitialFillInput.value = state.interstitialFill;
    tileStrokeInput.value = state.tileStroke;
    backgroundInput.value = state.background;
  };

  // Debounced URL-hash writer. Coalesces rapid changes (slider drag, wheel
  // zoom, pan) so the hash only gets stamped once interaction settles.
  // `history.replaceState` avoids polluting the back/forward stack and
  // doesn't fire `hashchange`.
  let hashTimer = null;
  const scheduleHashUpdate = () => {
    if (hashTimer !== null) clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      hashTimer = null;
      const enc = encodeState(state);
      try {
        history.replaceState(null, "", "#" + enc);
      } catch (_) {
        location.hash = enc;
      }
    }, 300);
  };

  // Initial state push.
  applyStateToDom();
  session.setStarAngle((state.angleDeg * Math.PI) / 180);
  session.setTileBandWidth(state.tileBandWidth);
  session.setStarBandWidth(state.starBandWidth);
  session.setShowStars(state.showStars);
  session.setShowTiles(state.showTiles);
  session.setShowTileWeave(state.tileWeave);
  session.setShowStarWeave(state.starWeave);
  pushColors();
  rebuildTilePalette();
  rebuildHarmonics();
  updateZoomReadout();
  applyBodyBackground();
  draw();

  // --- Controls ----------------------------------------------------------

  const switchConfig = (idx) => {
    state.configIdx = idx;
    state.panX = 0;
    state.panY = 0;
    state.zoom = RESET_ZOOM;
    select.value = String(idx);
    session.setConfig(idx);
    session.setStarAngle((state.angleDeg * Math.PI) / 180);
    session.setTileBandWidth(state.tileBandWidth);
    session.setStarBandWidth(state.starBandWidth);
    session.setShowStars(state.showStars);
    session.setShowTiles(state.showTiles);
    session.setShowTileWeave(state.tileWeave);
    session.setShowStarWeave(state.starWeave);
    pushColors();
    rebuildTilePalette();
    rebuildHarmonics();
    updateZoomReadout();
    draw();
    scheduleHashUpdate();
  };

  select.addEventListener("change", () => {
    switchConfig(parseInt(select.value, 10));
  });

  randomBtn.addEventListener("click", () => {
    if (configs.length <= 1) return;
    let idx = Math.floor(Math.random() * configs.length);
    if (idx === state.configIdx) {
      idx = (idx + 1) % configs.length;
    }
    switchConfig(idx);
  });

  showStarsCb.addEventListener("change", () => {
    state.showStars = showStarsCb.checked;
    session.setShowStars(state.showStars);
    draw();
    scheduleHashUpdate();
  });

  showTilesCb.addEventListener("change", () => {
    state.showTiles = showTilesCb.checked;
    session.setShowTiles(state.showTiles);
    draw();
    scheduleHashUpdate();
  });

  tileWeaveCb.addEventListener("change", () => {
    state.tileWeave = tileWeaveCb.checked;
    session.setShowTileWeave(state.tileWeave);
    draw();
    scheduleHashUpdate();
  });

  starWeaveCb.addEventListener("change", () => {
    state.starWeave = starWeaveCb.checked;
    session.setShowStarWeave(state.starWeave);
    draw();
    scheduleHashUpdate();
  });

  const formatAngle = (deg) =>
    Number.isInteger(deg) ? `${deg.toFixed(0)}°` : `${deg.toFixed(1)}°`;

  angle.addEventListener("input", () => {
    const raw = parseFloat(angle.value);
    const snapped = snapAngle(raw);
    state.angleDeg = snapped;
    if (snapped !== raw) angle.value = String(snapped);
    angleReadout.textContent = formatAngle(state.angleDeg);
    session.setStarAngle((state.angleDeg * Math.PI) / 180);
    draw();
    scheduleHashUpdate();
  });

  harmonicSnapCb.addEventListener("change", () => {
    state.harmonicSnap = harmonicSnapCb.checked;
    // Snap the current value immediately if turning the toggle on.
    if (state.harmonicSnap) {
      const snapped = snapAngle(state.angleDeg);
      if (snapped !== state.angleDeg) {
        state.angleDeg = snapped;
        angle.value = String(snapped);
        angleReadout.textContent = formatAngle(state.angleDeg);
        session.setStarAngle((state.angleDeg * Math.PI) / 180);
        draw();
      }
    }
    scheduleHashUpdate();
  });

  const updateTileBandReadout = () => {
    tileBandReadout.textContent = `${state.tileBandWidth.toFixed(1)} px`;
  };
  const updateStarBandReadout = () => {
    starBandReadout.textContent = `${state.starBandWidth.toFixed(1)} px`;
  };
  updateTileBandReadout();
  updateStarBandReadout();
  tileBand.addEventListener("input", () => {
    state.tileBandWidth = parseFloat(tileBand.value);
    updateTileBandReadout();
    session.setTileBandWidth(state.tileBandWidth);
    draw();
    scheduleHashUpdate();
  });
  starBand.addEventListener("input", () => {
    state.starBandWidth = parseFloat(starBand.value);
    updateStarBandReadout();
    session.setStarBandWidth(state.starBandWidth);
    draw();
    scheduleHashUpdate();
  });

  zoomSlider.addEventListener("input", () => {
    const newZoom = parseFloat(zoomSlider.value);
    // Center-anchored: keep the screen-center world point fixed by scaling
    // pan by the same ratio as zoom. (Without this, zoom is anchored at the
    // world origin, which sits off-screen once the user has panned and the
    // content appears to fly out from a corner.)
    const ratio = newZoom / state.zoom;
    state.panX *= ratio;
    state.panY *= ratio;
    state.zoom = newZoom;
    updateZoomReadout();
    draw();
    scheduleHashUpdate();
  });

  resetBtn.addEventListener("click", () => {
    state.panX = 0;
    state.panY = 0;
    state.zoom = RESET_ZOOM;
    updateZoomReadout();
    draw();
    scheduleHashUpdate();
  });

  // Colour pickers (non-palette ones).
  starFillInput.addEventListener("input", () => {
    state.starFill = starFillInput.value;
    const [r, g, b] = hexToRgb(state.starFill);
    session.setStarFillColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  starStrokeInput.addEventListener("input", () => {
    state.starStroke = starStrokeInput.value;
    const [r, g, b] = hexToRgb(state.starStroke);
    session.setStarStrokeColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  interstitialFillInput.addEventListener("input", () => {
    state.interstitialFill = interstitialFillInput.value;
    const [r, g, b] = hexToRgb(state.interstitialFill);
    session.setInterstitialFillColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  tileStrokeInput.addEventListener("input", () => {
    state.tileStroke = tileStrokeInput.value;
    const [r, g, b] = hexToRgb(state.tileStroke);
    session.setTileStrokeColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  backgroundInput.addEventListener("input", () => {
    state.background = backgroundInput.value;
    const [r, g, b] = hexToRgb(state.background);
    session.setBackground(r, g, b);
    applyBodyBackground();
    draw();
    scheduleHashUpdate();
  });

  // Pointer-based pan + pinch zoom. Pointer Events unify mouse, pen, and
  // touch, so this single block handles desktop drag, iPhone single-finger
  // pan, and iPhone two-finger pinch-zoom. The canvas CSS sets
  // `touch-action: none` so the browser doesn't claim touch gestures first.
  const pointers = new Map(); // pointerId -> { x, y }
  let lastMidX = 0;
  let lastMidY = 0;
  let lastDist = 0;

  const pointerMidpoint = () => {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const p of pointers.values()) {
      sx += p.x;
      sy += p.y;
      n += 1;
    }
    return n > 0 ? { x: sx / n, y: sy / n } : { x: 0, y: 0 };
  };

  const pointerSpread = () => {
    if (pointers.size !== 2) return 0;
    const it = pointers.values();
    const a = it.next().value;
    const b = it.next().value;
    return Math.hypot(b.x - a.x, b.y - a.y);
  };

  const resampleGesture = () => {
    const m = pointerMidpoint();
    lastMidX = m.x;
    lastMidY = m.y;
    lastDist = pointerSpread();
  };

  canvas.addEventListener("pointerdown", (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    // Any change in the active pointer set resets the gesture baseline,
    // so adding/removing a finger doesn't cause a one-frame jump from the
    // mismatch between the old midpoint/distance and the new pointer set.
    resampleGesture();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const m = pointerMidpoint();
    const d = pointerSpread();

    if (pointers.size === 1) {
      // Single-finger / mouse drag → pan.
      state.panX += m.x - lastMidX;
      state.panY += m.y - lastMidY;
    } else if (pointers.size === 2 && lastDist > 0 && d > 0) {
      // Two-finger pinch → zoom anchored at the gesture midpoint, plus
      // pan with the midpoint motion so the pinch also drags content.
      const factor = d / lastDist;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoom * factor));
      const cx = m.x - window.innerWidth / 2;
      const cy = m.y - window.innerHeight / 2;
      const wx = (cx - state.panX) / state.zoom;
      const wy = (cy - state.panY) / state.zoom;
      state.zoom = newZoom;
      state.panX = cx - wx * state.zoom;
      state.panY = cy - wy * state.zoom;
      state.panX += m.x - lastMidX;
      state.panY += m.y - lastMidY;
      updateZoomReadout();
    }

    lastMidX = m.x;
    lastMidY = m.y;
    lastDist = d;
    draw();
    scheduleHashUpdate();
  });

  const releasePointer = (e) => {
    if (pointers.has(e.pointerId)) {
      pointers.delete(e.pointerId);
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    resampleGesture();
  };
  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);

  // Wheel to zoom — centre-anchored, matching the slider. (Cursor-anchored
  // zoom is too aggressive when the cursor is near a corner: the content
  // appears to fly out of that corner. Keeping the screen-centre world
  // point fixed reads more naturally.)
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.001);
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoom * factor));
      const ratio = newZoom / state.zoom;
      state.panX *= ratio;
      state.panY *= ratio;
      state.zoom = newZoom;
      updateZoomReadout();
      draw();
      scheduleHashUpdate();
    },
    { passive: false }
  );

  // Prevent iOS Safari's legacy gesture events from firing alongside
  // Pointer Events (some Safari versions still emit these even with
  // `touch-action: none`). Without these, the OS may intercept a
  // two-finger pinch as a page-level zoom.
  canvas.addEventListener("gesturestart", (e) => e.preventDefault());
  canvas.addEventListener("gesturechange", (e) => e.preventDefault());
  canvas.addEventListener("gestureend", (e) => e.preventDefault());

  // Export buttons.
  svgBtn.addEventListener("click", () => {
    pushViewport();
    const svg = session.exportSvg();
    download(svg, `tiling-${configs[state.configIdx].replace(/\//g, "_")}.svg`, "image/svg+xml");
  });

  pngBtn.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `tiling-${configs[state.configIdx].replace(/\//g, "_")}.png`);
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }, "image/png");
  });
}

function download(text, filename, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

main().catch((err) => {
  console.error(err);
  document.body.innerHTML =
    '<div style="padding:20px;color:#900">Failed to load WASM: ' +
    String(err) +
    "</div>";
});
