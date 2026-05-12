// URL-hash state codec.
//
// Encode `state` as URL-safe base64(JSON) and decode back, so a hash makes
// each session a shareable permalink. Tiling identity is stored as its
// index into `TilingSession.listConfigs()` (single-byte) and other fields
// use compact key names to keep the URL short.
//
// Format is intentionally permissive on decode: unknown keys are ignored,
// missing keys leave the existing state untouched, and a legacy `b` band
// width key maps onto both per-layer widths so old URLs keep working.

function urlSafeBtoa(s) {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function urlSafeAtob(s) {
  const padLen = (4 - (s.length % 4)) % 4;
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLen));
}

export function encodeState(s) {
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

export function decodeStateInto(s, encoded) {
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
