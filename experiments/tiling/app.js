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
  configIdx: 0,
  angleDeg: 30,
  bandWidth: 4,
  showStars: true,
  showTiles: true,
  bandedMode: false,
  tileWeave: false,
  starWeave: false,
  // Mutable colour state — initialised from the input defaults below.
  tilePalette: { ...DEFAULT_TILE_PALETTE },
  starFill: "#ebd7af",
  starStroke: "#c82020",
  tileStroke: "#202020",
  background: "#ffffff",
};

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

  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  const select = document.getElementById("config-select");
  const randomBtn = document.getElementById("random");
  const angle = document.getElementById("angle");
  const angleReadout = document.getElementById("angle-readout");
  const band = document.getElementById("band");
  const bandReadout = document.getElementById("band-readout");
  const zoomSlider = document.getElementById("zoom");
  const zoomReadout = document.getElementById("zoom-readout");
  const showStarsCb = document.getElementById("show-stars");
  const showTilesCb = document.getElementById("show-tiles");
  const bandedCb = document.getElementById("banded");
  const tileWeaveCb = document.getElementById("tile-weave");
  const starWeaveCb = document.getElementById("star-weave");
  const resetBtn = document.getElementById("reset-view");
  const svgBtn = document.getElementById("export-svg");
  const pngBtn = document.getElementById("export-png");

  const tilePaletteContainer = document.getElementById("tile-palette");
  const starFillInput = document.getElementById("star-fill");
  const starStrokeInput = document.getElementById("star-stroke");
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
    session.setStarFillColor(sf[0], sf[1], sf[2]);
    session.setStarStrokeColor(ss[0], ss[1], ss[2]);
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
      });
      const label = document.createElement("span");
      label.textContent = `${n}-gon`;
      wrap.appendChild(input);
      wrap.appendChild(label);
      tilePaletteContainer.appendChild(wrap);
    }
  };

  // Initial state push.
  session.setStarAngle((state.angleDeg * Math.PI) / 180);
  session.setBandWidth(state.bandWidth);
  session.setShowStars(state.showStars);
  session.setShowTiles(state.showTiles);
  session.setBandedMode(state.bandedMode);
  session.setShowTileWeave(state.tileWeave);
  session.setShowStarWeave(state.starWeave);
  pushColors();
  rebuildTilePalette();
  updateZoomReadout();
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
    session.setBandWidth(state.bandWidth);
    session.setShowStars(state.showStars);
    session.setShowTiles(state.showTiles);
    session.setBandedMode(state.bandedMode);
    session.setShowTileWeave(state.tileWeave);
    session.setShowStarWeave(state.starWeave);
    pushColors();
    rebuildTilePalette();
    updateZoomReadout();
    draw();
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
  });

  showTilesCb.addEventListener("change", () => {
    state.showTiles = showTilesCb.checked;
    session.setShowTiles(state.showTiles);
    draw();
  });

  bandedCb.addEventListener("change", () => {
    state.bandedMode = bandedCb.checked;
    session.setBandedMode(state.bandedMode);
    draw();
  });

  tileWeaveCb.addEventListener("change", () => {
    state.tileWeave = tileWeaveCb.checked;
    session.setShowTileWeave(state.tileWeave);
    draw();
  });

  starWeaveCb.addEventListener("change", () => {
    state.starWeave = starWeaveCb.checked;
    session.setShowStarWeave(state.starWeave);
    draw();
  });

  angle.addEventListener("input", () => {
    state.angleDeg = parseFloat(angle.value);
    angleReadout.textContent = `${state.angleDeg.toFixed(0)}°`;
    session.setStarAngle((state.angleDeg * Math.PI) / 180);
    draw();
  });

  const updateBandReadout = () => {
    bandReadout.textContent = `${state.bandWidth.toFixed(1)} px`;
  };
  updateBandReadout();
  band.addEventListener("input", () => {
    state.bandWidth = parseFloat(band.value);
    updateBandReadout();
    session.setBandWidth(state.bandWidth);
    draw();
  });

  zoomSlider.addEventListener("input", () => {
    state.zoom = parseFloat(zoomSlider.value);
    updateZoomReadout();
    draw();
  });

  resetBtn.addEventListener("click", () => {
    state.panX = 0;
    state.panY = 0;
    state.zoom = RESET_ZOOM;
    updateZoomReadout();
    draw();
  });

  // Colour pickers (non-palette ones).
  starFillInput.addEventListener("input", () => {
    state.starFill = starFillInput.value;
    const [r, g, b] = hexToRgb(state.starFill);
    session.setStarFillColor(r, g, b);
    draw();
  });
  starStrokeInput.addEventListener("input", () => {
    state.starStroke = starStrokeInput.value;
    const [r, g, b] = hexToRgb(state.starStroke);
    session.setStarStrokeColor(r, g, b);
    draw();
  });
  tileStrokeInput.addEventListener("input", () => {
    state.tileStroke = tileStrokeInput.value;
    const [r, g, b] = hexToRgb(state.tileStroke);
    session.setTileStrokeColor(r, g, b);
    draw();
  });
  backgroundInput.addEventListener("input", () => {
    state.background = backgroundInput.value;
    const [r, g, b] = hexToRgb(state.background);
    session.setBackground(r, g, b);
    applyBodyBackground();
    draw();
  });

  // Drag to pan.
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    state.panX += e.clientX - lastX;
    state.panY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    draw();
  });
  const endDrag = (e) => {
    dragging = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  // Wheel to zoom (centred on cursor).
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;

      const factor = Math.exp(-e.deltaY * 0.001);
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoom * factor));
      const wx = (cx - state.panX) / state.zoom;
      const wy = (cy - state.panY) / state.zoom;
      state.zoom = newZoom;
      state.panX = cx - wx * state.zoom;
      state.panY = cy - wy * state.zoom;
      updateZoomReadout();
      draw();
    },
    { passive: false }
  );

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
