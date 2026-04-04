export interface FrameInputs {
  artWidth: number;
  artHeight: number;
  matWidth: number;
  matOverlap: number;
  frameWidth: number;
  rabbetDepth: number;
}

export interface FrameResults {
  longSide: number;
  shortSide: number;
  longSideRough: number;
  shortSideRough: number;
  roughCutAllowance: number;
  outerWidth: number;
  outerHeight: number;
  totalLumber: number;
  miterAngle: number;
}

// Extra length added to each piece before the final miter cut, to account
// for waste and blade kerf during the two miter cuts.
export const ROUGH_CUT_ALLOWANCE = 0.5;

export function calculateFrame(inputs: FrameInputs): FrameResults {
  const { artWidth, artHeight, matWidth, matOverlap, frameWidth } = inputs;

  // matWidth is the visible mat border from the opening edge to the mat edge.
  // Mat opening = artwork - 2*overlap, mat visible outer = opening + 2*matWidth.
  const outerWidth = artWidth - 2 * matOverlap + 2 * matWidth + 2 * frameWidth;
  const outerHeight = artHeight - 2 * matOverlap + 2 * matWidth + 2 * frameWidth;

  const longSide = Math.max(outerWidth, outerHeight);
  const shortSide = Math.min(outerWidth, outerHeight);
  const longSideRough = longSide + ROUGH_CUT_ALLOWANCE;
  const shortSideRough = shortSide + ROUGH_CUT_ALLOWANCE;

  return {
    longSide,
    shortSide,
    longSideRough,
    shortSideRough,
    roughCutAllowance: ROUGH_CUT_ALLOWANCE,
    outerWidth,
    outerHeight,
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
