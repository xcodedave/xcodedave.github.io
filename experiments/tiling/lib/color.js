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
