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
  interstitialFill: "#c8643c",
  // Per-layer ribbon colours. Defaults reproduce the prior "background body +
  // polygon-stroke rails" look so users on existing hashes see no visual
  // change until they pick a colour.
  starRibbonFill: "#ffffff",
  starRibbonStroke: "#c82020",
  tileRibbonFill: "#ffffff",
  tileRibbonStroke: "#202020",
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
    bw: s.interstitialFill,
    srf: s.starRibbonFill,
    srs: s.starRibbonStroke,
    trf: s.tileRibbonFill,
    trs: s.tileRibbonStroke,
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
  if (typeof obj.bw === "string") s.interstitialFill = obj.bw;
  if (typeof obj.srf === "string") s.starRibbonFill = obj.srf;
  if (typeof obj.srs === "string") s.starRibbonStroke = obj.srs;
  if (typeof obj.trf === "string") s.tileRibbonFill = obj.trf;
  if (typeof obj.trs === "string") s.tileRibbonStroke = obj.trs;
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

// HSL helpers used by the palette-randomiser to apply an optional global
// hue rotation. HSL preserves perceptual lightness across hues better than
// HSV, so a rotated palette retains its dark/medium/light banding.
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d) + (g < b ? 6 : 0);
  else if (max === g) h = ((b - r) / d) + 2;
  else h = ((r - g) / d) + 4;
  return [h * 60, s, l];
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const k = (t) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(k(h + 1 / 3) * 255),
    Math.round(k(h) * 255),
    Math.round(k(h - 1 / 3) * 255),
  ];
}
function hueShiftHex(hex, deltaDeg) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [r2, g2, b2] = hslToRgb(h + deltaDeg, s, l);
  return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
}
// Multiplicative saturation boost: s' = clamp(s * (1 + factor), 0, 1).
function saturateHex(hex, factor) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const s2 = Math.max(0, Math.min(1, s * (1 + factor)));
  const [r2, g2, b2] = hslToRgb(h, s2, l);
  return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
}

async function main() {
  await init();

  // Apply any state encoded in the URL hash *before* we wire up the session
  // and DOM, so dropdowns/sliders/colour pickers all start in the saved
  // state rather than briefly flashing the defaults.
  //
  // We also note whether the hash carried explicit star-colour overrides:
  // if it did, the user followed a permalink and we must not override
  // their colours with the launch randomiser. If not, we'll pick a random
  // palette once the curated palette set finishes loading.
  let hashHadStarColors = false;
  if (location.hash && location.hash.length > 1) {
    const encoded = location.hash.slice(1);
    decodeStateInto(state, encoded);
    try {
      const obj = JSON.parse(urlSafeAtob(encoded));
      hashHadStarColors = obj && (
        "sf" in obj || "bw" in obj || "srf" in obj || "srs" in obj
      );
    } catch (_) { /* malformed hash; treat as no colours */ }
  }

  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const select = document.getElementById("config-select");
  const randomBtn = document.getElementById("random");
  const panel = document.getElementById("panel");
  const panelToggleBtn = document.getElementById("panel-toggle");
  panelToggleBtn.addEventListener("click", () => {
    const collapsed = panel.classList.toggle("collapsed");
    panelToggleBtn.setAttribute("aria-expanded", String(!collapsed));
    panelToggleBtn.title = collapsed ? "Expand panel" : "Collapse panel";
    panelToggleBtn.setAttribute("aria-label", collapsed ? "Expand panel" : "Collapse panel");
    // ☰ is the universal "open menu" affordance; ✕ is the universal
    // "close / minimise" affordance. Swapping the glyph makes the
    // button's purpose obvious without a text label.
    panelToggleBtn.textContent = collapsed ? "☰" : "✕";
  });
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
  const starsGroup = document.getElementById("stars-group");
  const tilesGroup = document.getElementById("tiles-group");
  const tileWeaveCb = document.getElementById("tile-weave");
  const starWeaveCb = document.getElementById("star-weave");
  const harmonicSnapCb = document.getElementById("harmonic-snap");
  const resetBtn = document.getElementById("reset-view");
  const svgBtn = document.getElementById("export-svg");
  const pngBtn = document.getElementById("export-png");

  const tilePaletteContainer = document.getElementById("tile-palette");
  const starFillInput = document.getElementById("star-fill");
  const interstitialFillInput = document.getElementById("interstitial-fill");
  const starRibbonFillInput = document.getElementById("star-ribbon-fill");
  const starRibbonStrokeInput = document.getElementById("star-ribbon-stroke");
  const tileRibbonFillInput = document.getElementById("tile-ribbon-fill");
  const tileRibbonStrokeInput = document.getElementById("tile-ribbon-stroke");
  const backgroundInput = document.getElementById("background");
  const paletteRandomizeBtn = document.getElementById("palette-randomize");

  // Apply the body background colour outside the canvas so the floating
  // panel sits on the same colour the canvas fills with.
  const applyBodyBackground = () => {
    document.body.style.background = state.background;
  };
  applyBodyBackground();

  // Hide group fieldsets entirely when their master toggle is off.
  const applyGroupVisibility = () => {
    starsGroup.hidden = !state.showStars;
    tilesGroup.hidden = !state.showTiles;
  };

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
    const bg = hexToRgb(state.background);
    const inter = hexToRgb(state.interstitialFill);
    session.setStarFillColor(sf[0], sf[1], sf[2]);
    session.setInterstitialFillColor(inter[0], inter[1], inter[2]);
    const srf = hexToRgb(state.starRibbonFill);
    const srs = hexToRgb(state.starRibbonStroke);
    const trf = hexToRgb(state.tileRibbonFill);
    const trs = hexToRgb(state.tileRibbonStroke);
    session.setStarRibbonFillColor(srf[0], srf[1], srf[2]);
    session.setStarRibbonStrokeColor(srs[0], srs[1], srs[2]);
    session.setTileRibbonFillColor(trf[0], trf[1], trf[2]);
    session.setTileRibbonStrokeColor(trs[0], trs[1], trs[2]);
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
    applyGroupVisibility();
    tileWeaveCb.checked = state.tileWeave;
    starWeaveCb.checked = state.starWeave;
    harmonicSnapCb.checked = state.harmonicSnap;
    starFillInput.value = state.starFill;
    interstitialFillInput.value = state.interstitialFill;
    starRibbonFillInput.value = state.starRibbonFill;
    starRibbonStrokeInput.value = state.starRibbonStroke;
    tileRibbonFillInput.value = state.tileRibbonFill;
    tileRibbonStrokeInput.value = state.tileRibbonStroke;
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
    // 1) Pick a random *different* tiling. `switchConfig` also rebuilds
    //    `state.harmonics` for the new shape set, which we need below
    //    before picking an angle.
    let idx = Math.floor(Math.random() * configs.length);
    if (idx === state.configIdx) {
      idx = (idx + 1) % configs.length;
    }
    switchConfig(idx);

    // 2) Randomise whether the star ribbon (weave) is shown.
    starWeaveCb.checked = Math.random() < 0.5;
    starWeaveCb.dispatchEvent(new Event("change"));

    // 3) Randomise the star ribbon width across the full slider range
    //    [0, 40] with the slider's own 0.5 step.
    const w = Math.round(Math.random() * 80) / 2;
    starBand.value = String(w);
    starBand.dispatchEvent(new Event("input"));

    // 4) Randomise the star contact angle. 50% of the time snap straight to
    //    a harmonic from the current tiling (the visually-pleasing
    //    integer-fraction angles); otherwise pick a uniform [0, 90] value
    //    at the slider's 0.5° step and let the existing input listener
    //    apply harmonic-snap if the user has it on.
    let deg;
    if (Math.random() < 0.5 && state.harmonics.length > 0) {
      deg = state.harmonics[Math.floor(Math.random() * state.harmonics.length)];
    } else {
      deg = Math.round(Math.random() * 180) / 2;
    }
    angle.value = String(deg);
    angle.dispatchEvent(new Event("input"));

    // 5) Randomise the star colour palette (reuses the dice-button logic
    //    including the optional shuffle + edge-darken rolls).
    applyRandomPalette();
  });

  showStarsCb.addEventListener("change", () => {
    state.showStars = showStarsCb.checked;
    session.setShowStars(state.showStars);
    applyGroupVisibility();
    draw();
    scheduleHashUpdate();
  });

  showTilesCb.addEventListener("change", () => {
    state.showTiles = showTilesCb.checked;
    session.setShowTiles(state.showTiles);
    applyGroupVisibility();
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
  interstitialFillInput.addEventListener("input", () => {
    state.interstitialFill = interstitialFillInput.value;
    const [r, g, b] = hexToRgb(state.interstitialFill);
    session.setInterstitialFillColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  starRibbonFillInput.addEventListener("input", () => {
    state.starRibbonFill = starRibbonFillInput.value;
    const [r, g, b] = hexToRgb(state.starRibbonFill);
    session.setStarRibbonFillColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  starRibbonStrokeInput.addEventListener("input", () => {
    state.starRibbonStroke = starRibbonStrokeInput.value;
    const [r, g, b] = hexToRgb(state.starRibbonStroke);
    session.setStarRibbonStrokeColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  tileRibbonFillInput.addEventListener("input", () => {
    state.tileRibbonFill = tileRibbonFillInput.value;
    const [r, g, b] = hexToRgb(state.tileRibbonFill);
    session.setTileRibbonFillColor(r, g, b);
    draw();
    scheduleHashUpdate();
  });
  tileRibbonStrokeInput.addEventListener("input", () => {
    state.tileRibbonStroke = tileRibbonStrokeInput.value;
    const [r, g, b] = hexToRgb(state.tileRibbonStroke);
    session.setTileRibbonStrokeColor(r, g, b);
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

  // Curated palettes are baked into the wasm bundle (see
  // crates/gjh-wasm/data/palettes.json + build.rs), so picking one is a
  // synchronous call with no fetch, no parsing, no failure mode. The launch
  // randomiser fires immediately unless the user followed a permalink that
  // carried explicit star colours — those must not be clobbered.
  const applyRandomPalette = () => {
    // 50% of the time, rotate the whole palette in HSL hue space by a
    // uniform random amount. All four colours shift by the same angle so
    // the relative palette structure is preserved — only the colour key
    // changes (e.g. an ochre/terracotta palette becomes teal/violet).
    let quad = Array.from(TilingSession.randomPalette());
    if (Math.random() < 0.5) {
      const delta = Math.random() * 360;
      quad = quad.map((c) => hueShiftHex(c, delta));
    }
    // Always nudge saturation up by a uniform random factor in [0, 0.35].
    // Mined palettes lean muted (real-world tile photography); a small
    // multiplicative boost pops them on the canvas without over-cooking
    // the already-vivid ones (clamped at 1.0).
    const satBoost = Math.random() * 0.35;
    if (satBoost > 0) {
      quad = quad.map((c) => saturateHex(c, satBoost));
    }
    // 50% of the time, shuffle the four colours within the palette so they
    // map differently onto (star, polygon, ribbon-fill, ribbon-stroke) —
    // gives the dice button more variety without enlarging the palette set.
    // Fisher–Yates over a 4-element array is fine; no Set needed.
    if (Math.random() < 0.5) {
      for (let i = quad.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quad[i], quad[j]] = [quad[j], quad[i]];
      }
    }
    let [sf, intf, rf, rs] = quad;
    // 50% of the time, override the ribbon-stroke (edge) colour with a
    // darkened version of the ribbon fill (between 65% and 95% darker,
    // uniform) — gives the weave a tonal-on-tonal feel rather than always
    // pulling a fourth distinct hue, and the random magnitude keeps it
    // from settling into one "look".
    if (Math.random() < 0.5) {
      const [r, g, b] = hexToRgb(rf);
      const keep = 0.05 + Math.random() * 0.30; // 5–35% of original brightness
      const darken = (c) => Math.round(c * keep).toString(16).padStart(2, "0");
      rs = `#${darken(r)}${darken(g)}${darken(b)}`;
    }
    starFillInput.value = sf;
    interstitialFillInput.value = intf;
    starRibbonFillInput.value = rf;
    starRibbonStrokeInput.value = rs;
    // Re-use the existing input listeners to propagate state + push the
    // colours into the wasm session + redraw + sync the URL hash.
    starFillInput.dispatchEvent(new Event("input"));
    interstitialFillInput.dispatchEvent(new Event("input"));
    starRibbonFillInput.dispatchEvent(new Event("input"));
    starRibbonStrokeInput.dispatchEvent(new Event("input"));
  };
  paletteRandomizeBtn.addEventListener("click", applyRandomPalette);
  paletteRandomizeBtn.disabled = false;
  if (!hashHadStarColors) applyRandomPalette();

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
      const dx = m.x - lastMidX;
      const dy = m.y - lastMidY;
      // When the panel is collapsed AND the input is touch, repurpose the
      // single-finger drag: horizontal → star angle, vertical → star ribbon
      // width. Rationale: in collapsed-mobile mode the sliders are hidden
      // and there's no other way to live-tune those parameters, while
      // panning is less interesting when the user can't see what they're
      // moving away from. Two-finger pinch still zooms normally below.
      const mobileCollapsed =
        panel.classList.contains("collapsed") && e.pointerType === "touch";
      if (mobileCollapsed) {
        // ~360px of horizontal travel = full 0–90° sweep (one phone-width-ish).
        if (dx !== 0) {
          const raw = Math.max(0, Math.min(90, state.angleDeg + dx * (90 / 360)));
          const snapped = snapAngle(raw);
          state.angleDeg = snapped;
          angle.value = String(snapped);
          angleReadout.textContent = formatAngle(state.angleDeg);
          session.setStarAngle((state.angleDeg * Math.PI) / 180);
        }
        // Drag up = thicker ribbon (matches the up-arrow-as-"more" idiom).
        // ~360px of vertical travel = full 0–40px sweep.
        if (dy !== 0) {
          const w = Math.max(0, Math.min(40, state.starBandWidth - dy * (40 / 360)));
          state.starBandWidth = Math.round(w * 2) / 2;
          starBand.value = String(state.starBandWidth);
          starBandReadout.textContent = `${state.starBandWidth.toFixed(1)} px`;
          session.setStarBandWidth(state.starBandWidth);
        }
      } else {
        state.panX += dx;
        state.panY += dy;
      }
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
