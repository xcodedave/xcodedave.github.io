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

const state = {
  panX: 0,
  panY: 0,
  zoom: RESET_ZOOM,
  configIdx: 0,
  angleDeg: 30,
  bandWidth: 4,
  showStars: true,
  showTiles: true,
};

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
  const resetBtn = document.getElementById("reset-view");
  const svgBtn = document.getElementById("export-svg");
  const pngBtn = document.getElementById("export-png");

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

  // Initial state push.
  session.setStarAngle((state.angleDeg * Math.PI) / 180);
  session.setBandWidth(state.bandWidth);
  session.setShowStars(state.showStars);
  session.setShowTiles(state.showTiles);
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
