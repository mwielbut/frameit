export interface FrameInputs {
  artWidth: number;
  artHeight: number;
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
  artWidth: number;
  artHeight: number;
  matWidth: number;
  matOverlap: number;
  frameWidth: number;
  rabbetDepth: number;

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

export function frameGeometry(inputs: FrameInputs): FrameGeometry {
  const { artWidth, artHeight, matWidth, matOverlap, frameWidth, rabbetDepth } = inputs;

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
