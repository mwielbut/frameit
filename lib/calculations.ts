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
  outerWidth: number;
  outerHeight: number;
  totalLumber: number;
  miterAngle: number;
}

export function calculateFrame(inputs: FrameInputs): FrameResults {
  const { artWidth, artHeight, matWidth, matOverlap, frameWidth } = inputs;

  // Mat overlap only affects mat opening, not outer frame dimensions
  const outerWidth = artWidth + 2 * matWidth + 2 * frameWidth;
  const outerHeight = artHeight + 2 * matWidth + 2 * frameWidth;

  const longSide = Math.max(outerWidth, outerHeight);
  const shortSide = Math.min(outerWidth, outerHeight);

  return {
    longSide,
    shortSide,
    outerWidth,
    outerHeight,
    totalLumber: 2 * longSide + 2 * shortSide,
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
