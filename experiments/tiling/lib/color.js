// Pure colour utilities — hex parsing, RGB↔HSL conversion, and hue / saturation
// adjustments used by the palette randomiser. No DOM access.

export function hexToRgb(hex) {
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
export function rgbToHsl(r, g, b) {
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

export function hslToRgb(h, s, l) {
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

export function hueShiftHex(hex, deltaDeg) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [r2, g2, b2] = hslToRgb(h + deltaDeg, s, l);
  return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
}

// Multiplicative saturation boost: s' = clamp(s * (1 + factor), 0, 1).
export function saturateHex(hex, factor) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const s2 = Math.max(0, Math.min(1, s * (1 + factor)));
  const [r2, g2, b2] = hslToRgb(h, s2, l);
  return `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;
}

// The mined-palette dice roll, extracted from app.js so it can be tested
// without a DOM. `quad` is [star fill, interstitial, ribbon fill, ribbon
// stroke] as hex strings; `rand` is a Math.random-like source. The operations
// and the order of `rand()` calls are exactly those of the original
// applyRandomPalette body (after the quad was drawn from the baked set).
export function minedPaletteFromQuad(quad, rand) {
  quad = quad.slice();
  // 50% of the time, rotate the whole palette in HSL hue space by a
  // uniform random amount. All four colours shift by the same angle so
  // the relative palette structure is preserved — only the colour key
  // changes (e.g. an ochre/terracotta palette becomes teal/violet).
  if (rand() < 0.5) {
    const delta = rand() * 360;
    quad = quad.map((c) => hueShiftHex(c, delta));
  }
  // Always nudge saturation up by a uniform random factor in [0, 0.35].
  // Mined palettes lean muted (real-world tile photography); a small
  // multiplicative boost pops them on the canvas without over-cooking
  // the already-vivid ones (clamped at 1.0).
  const satBoost = rand() * 0.35;
  if (satBoost > 0) {
    quad = quad.map((c) => saturateHex(c, satBoost));
  }
  // 50% of the time, shuffle the four colours within the palette so they
  // map differently onto (star, polygon, ribbon-fill, ribbon-stroke) —
  // gives the dice button more variety without enlarging the palette set.
  // Fisher–Yates over a 4-element array is fine; no Set needed.
  if (rand() < 0.5) {
    for (let i = quad.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [quad[i], quad[j]] = [quad[j], quad[i]];
    }
  }
  let [sf, intf, rf, rs] = quad;
  // 50% of the time, override the ribbon-stroke (edge) colour with a
  // darkened version of the ribbon fill (between 65% and 95% darker,
  // uniform) — gives the weave a tonal-on-tonal feel rather than always
  // pulling a fourth distinct hue, and the random magnitude keeps it
  // from settling into one "look".
  if (rand() < 0.5) {
    const [r, g, b] = hexToRgb(rf);
    const keep = 0.05 + rand() * 0.30; // 5–35% of original brightness
    const darken = (c) => Math.round(c * keep).toString(16).padStart(2, "0");
    rs = `#${darken(r)}${darken(g)}${darken(b)}`;
  }
  return [sf, intf, rf, rs];
}
