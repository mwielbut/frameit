/**
 * Which dimension the user is holding fixed. The two input fields
 * (`inputWidth` / `inputHeight`) are interpreted through this discriminator:
 *   - "artwork":    the user knows the artwork size and everything else flows
 *   - "frameOuter": the user already has a frame and wants to fit art into it
 *   - "matBoard":   the user already has a mat board and wants to build a frame
 */
export type InputMode = "artwork" | "frameOuter" | "matBoard";

export interface FrameInputs {
  name: string;
  mode: InputMode;
  inputWidth: number;
  inputHeight: number;
  matWidth: number;
  matOverlap: number;
  frameWidth: number;
  rabbetDepth: number;
}

/**
 * Complete dimensional model of a frame. Every derived quantity any caller
 * could want is here — callers must never do arithmetic on raw inputs.
 *
 * Invariants:
 *   matOpening     = artwork − 2·matOverlap
 *   matBoard       = matOpening + 2·matWidth + 2·rabbetDepth
 *   glass          = matBoard                  (fills the rabbet)
 *   outer          = matOpening + 2·matWidth + 2·frameWidth
 *                  = visible mat area + 2·frameWidth (rabbet excluded —
 *                    the mat board extends behind the frame lip, not past it)
 */
export interface FrameGeometry {
  // echoed inputs so callers take one prop instead of two
  name: string;
  mode: InputMode;
  // The raw input pair the user is editing, echoed verbatim (not clamped) so
  // input fields can display exactly what was typed even when the inversion
  // produced a non-positive artwork and had to be clamped.
  inputWidth: number;
  inputHeight: number;
  artWidth: number;
  artHeight: number;
  matWidth: number;
  matOverlap: number;
  frameWidth: number;
  rabbetDepth: number;

  // True when the chosen input dimensions (in frameOuter or matBoard mode)
  // are too small for the current mat/frame settings to leave any artwork.
  // The UI shows a warning; geometry is clamped to a tiny positive artwork
  // so the diagram doesn't render with negative values.
  artInvalid: boolean;

  // mat
  matOpeningWidth: number;
  matOpeningHeight: number;
  matBoardWidth: number;
  matBoardHeight: number;

  // glass panel (matches mat board — same rabbet)
  glassWidth: number;
  glassHeight: number;

  // frame outer (the miter-cut dimensions)
  outerWidth: number;
  outerHeight: number;

  // cut list
  longSide: number;
  shortSide: number;
  longSideRough: number;
  shortSideRough: number;
  roughCutAllowance: number;
  totalLumber: number;
  miterAngle: 45;
}

// Extra length added to each piece before the final miter cut, to account
// for waste and blade kerf during the two miter cuts.
export const ROUGH_CUT_ALLOWANCE = 0.5;

// Smallest artwork dimension we'll allow before clamping. Keeps the SVG
// from rendering negative rectangles while still signaling to the user (via
// `artInvalid`) that their inputs don't leave room for any real artwork.
const MIN_ART_DIMENSION = 0.01;

export function frameGeometry(inputs: FrameInputs): FrameGeometry {
  const {
    name,
    mode,
    inputWidth,
    inputHeight,
    matWidth,
    matOverlap,
    frameWidth,
    rabbetDepth,
  } = inputs;

  // Derive the canonical artwork dimensions from whichever dimension the
  // user is holding fixed. Everything downstream stays artwork-centric.
  let rawArtWidth: number;
  let rawArtHeight: number;
  switch (mode) {
    case "artwork":
      rawArtWidth = inputWidth;
      rawArtHeight = inputHeight;
      break;
    case "frameOuter": {
      // Invert outer = (art − 2·overlap) + 2·matWidth + 2·frameWidth
      const delta = 2 * (matWidth + frameWidth - matOverlap);
      rawArtWidth = inputWidth - delta;
      rawArtHeight = inputHeight - delta;
      break;
    }
    case "matBoard": {
      // Invert board = (art − 2·overlap) + 2·matWidth + 2·rabbetDepth
      const delta = 2 * (matWidth + rabbetDepth - matOverlap);
      rawArtWidth = inputWidth - delta;
      rawArtHeight = inputHeight - delta;
      break;
    }
  }

  const artInvalid =
    rawArtWidth < MIN_ART_DIMENSION || rawArtHeight < MIN_ART_DIMENSION;
  const artWidth = Math.max(rawArtWidth, MIN_ART_DIMENSION);
  const artHeight = Math.max(rawArtHeight, MIN_ART_DIMENSION);

  // matWidth is the visible mat border measured from the mat opening edge.
  const matOpeningWidth = artWidth - 2 * matOverlap;
  const matOpeningHeight = artHeight - 2 * matOverlap;

  // The mat board extends into the frame rabbet on each side, so the
  // orderable board is larger than the visible mat area.
  const matBoardWidth = matOpeningWidth + 2 * matWidth + 2 * rabbetDepth;
  const matBoardHeight = matOpeningHeight + 2 * matWidth + 2 * rabbetDepth;

  // Glass sits in the same rabbet opening as the mat board.
  const glassWidth = matBoardWidth;
  const glassHeight = matBoardHeight;

  // Frame outer = visible mat area + 2·frameWidth. Rabbet depth is excluded
  // because the mat board tucks behind the frame lip, not past it.
  const outerWidth = matOpeningWidth + 2 * matWidth + 2 * frameWidth;
  const outerHeight = matOpeningHeight + 2 * matWidth + 2 * frameWidth;

  const longSide = Math.max(outerWidth, outerHeight);
  const shortSide = Math.min(outerWidth, outerHeight);
  const longSideRough = longSide + ROUGH_CUT_ALLOWANCE;
  const shortSideRough = shortSide + ROUGH_CUT_ALLOWANCE;

  return {
    name,
    mode,
    inputWidth,
    inputHeight,
    artInvalid,
    artWidth,
    artHeight,
    matWidth,
    matOverlap,
    frameWidth,
    rabbetDepth,
    matOpeningWidth,
    matOpeningHeight,
    matBoardWidth,
    matBoardHeight,
    glassWidth,
    glassHeight,
    outerWidth,
    outerHeight,
    longSide,
    shortSide,
    longSideRough,
    shortSideRough,
    roughCutAllowance: ROUGH_CUT_ALLOWANCE,
    totalLumber: 2 * longSideRough + 2 * shortSideRough,
    miterAngle: 45,
  };
}

/**
 * Toggle the input mode while keeping the rendered geometry identical —
 * re-seeds `inputWidth` / `inputHeight` from the current geometry so the
 * diagram doesn't jump when the user switches. Pure function.
 */
export function switchMode(prev: FrameInputs, next: InputMode): FrameInputs {
  if (prev.mode === next) return prev;
  const geo = frameGeometry(prev);
  let inputWidth: number;
  let inputHeight: number;
  switch (next) {
    case "artwork":
      inputWidth = geo.artWidth;
      inputHeight = geo.artHeight;
      break;
    case "frameOuter":
      inputWidth = geo.outerWidth;
      inputHeight = geo.outerHeight;
      break;
    case "matBoard":
      inputWidth = geo.matBoardWidth;
      inputHeight = geo.matBoardHeight;
      break;
  }
  return { ...prev, mode: next, inputWidth, inputHeight };
}

export function formatFraction(value: number): string {
  const fractions: [number, string][] = [
    [0.125, "1/8"],
    [0.25, "1/4"],
    [0.375, "3/8"],
    [0.5, "1/2"],
    [0.625, "5/8"],
    [0.75, "3/4"],
    [0.875, "7/8"],
  ];

  const whole = Math.floor(value);
  const frac = value - whole;

  const match = fractions.find(([f]) => Math.abs(frac - f) < 0.01);

  if (match) {
    return whole > 0 ? `${whole} ${match[1]}` : match[1];
  }

  if (Math.abs(frac) < 0.01) {
    return `${whole}`;
  }

  return value.toFixed(2);
}

/**
 * Format a width × height pair as a display string, e.g. `16" × 20 1/4"`.
 * Lives here so every render site shares one canonical pair format.
 */
export function formatPair(w: number, h: number): string {
  return `${formatFraction(w)}" × ${formatFraction(h)}"`;
}
