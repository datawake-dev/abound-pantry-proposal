/**
 * WCAG 2.1 relative luminance and contrast ratio utilities.
 *
 * Used to validate every surface/foreground pair documented in DESIGN.md §3.5.
 * Pure math; no browser APIs; safe in jsdom, Node, and the browser.
 */

function srgbToLinear(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) {
    throw new Error(`contrast: expected 6-digit hex, got "${hex}"`);
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return [r, g, b];
}

export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

/**
 * WCAG 2.1 contrast ratio between two sRGB colors.
 * Returns a number in [1, 21]. Higher = more contrast.
 */
export function getContrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}
