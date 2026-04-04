"use client";

import { FrameInputs, FrameResults, formatFraction } from "../lib/calculations";

interface FrameDiagramProps {
  inputs: FrameInputs;
  results: FrameResults;
}

export default function FrameDiagram({ inputs, results }: FrameDiagramProps) {
  const { artWidth, artHeight, matWidth, matOverlap, frameWidth, rabbetDepth } = inputs;
  const { outerWidth, outerHeight } = results;

  // SVG viewBox dimensions
  const vw = 1060;
  const vh = 900;

  // Scale factor: fit the frame into a ~500px area centered in the diagram
  const maxDiagramSize = 480;
  const scale = Math.min(maxDiagramSize / outerWidth, maxDiagramSize / outerHeight);

  const frameW = outerWidth * scale;
  const frameH = outerHeight * scale;

  // Center the frame in the diagram area, offset left to make room for annotations
  const cx = vw / 2 - 60;
  const cy = 420;
  const fx = cx - frameW / 2;
  const fy = cy - frameH / 2;

  // Inner layers
  const innerFrameInset = frameWidth * scale;

  // Positions
  const matX = fx + innerFrameInset;
  const matY = fy + innerFrameInset;
  const matW = frameW - 2 * innerFrameInset;
  const matH = frameH - 2 * innerFrameInset;

  // Artwork sits centered within the mat. The visible mat border (matWidth)
  // is measured from the mat opening; the artwork extends matOverlap past the
  // opening on each side, so the gap from mat edge to artwork is matWidth - matOverlap.
  const artDisplayW = artWidth * scale;
  const artDisplayH = artHeight * scale;
  const artInset = Math.max(0, matWidth - matOverlap) * scale;
  const artX = matX + artInset;
  const artY = matY + artInset;

  // Dimension line positions
  const dimGap = 30;
  const tickLen = 13;

  // Side-panel boxes (Mat Overview and Glass Overview)
  const cdX = 760;
  const cdY = 130;
  const cdW = 250;
  const cdH = 220;

  // Glass Overview box (below Mat Overview)
  const gX = cdX;
  const gY = cdY + cdH + 24;
  const gW = cdW;
  const gH = 160;

  return (
    <div className="flex-1 h-full bg-[#F8F6F1] overflow-hidden flex items-center justify-center">
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full h-full" style={{ maxHeight: "100%" }}>
        {/* Grid lines */}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`hg${i}`} x1={0} y1={80 * (i + 1)} x2={vw} y2={80 * (i + 1)} stroke="#E0DDD5" strokeOpacity={0.4} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`vg${i}`} x1={80 * (i + 1)} y1={0} x2={80 * (i + 1)} y2={vh} stroke="#E0DDD5" strokeOpacity={0.4} />
        ))}

        {/* Title */}
        <text x={cx} y={38} textAnchor="middle" className="font-mono" fontSize={16} fontWeight={500} letterSpacing={4} fill="#2C2C2C">
          FRAME ASSEMBLY — TOP VIEW
        </text>
        <text x={cx} y={62} textAnchor="middle" className="font-mono" fontSize={10} letterSpacing={2} fill="#9A968E">
          Scale: proportional | All dimensions in inches
        </text>

        {/* Frame outer (wood dark) */}
        <rect x={fx} y={fy} width={frameW} height={frameH} rx={2} fill="#8B7355" />
        {/* Frame inner (wood light) */}
        <rect x={fx + 4} y={fy + 4} width={frameW - 8} height={frameH - 8} rx={1} fill="#A89070" />
        {/* Mat area */}
        <rect x={matX} y={matY} width={matW} height={matH} fill="#F0EDE5" stroke="#D8D4CB" />
        {/* Artwork area */}
        <rect x={artX} y={artY} width={artDisplayW} height={artDisplayH} fill="#E8E4DB" stroke="#D4D0C8" />

        {/* Overlap strips (orange highlight) */}
        {matOverlap > 0 && (
          <>
            <rect x={artX} y={artY} width={artDisplayW} height={matOverlap * scale} fill="#D4933A" opacity={0.35} />
            <rect x={artX} y={artY} width={matOverlap * scale} height={artDisplayH} fill="#D4933A" opacity={0.35} />
            <rect x={artX + artDisplayW - matOverlap * scale} y={artY} width={matOverlap * scale} height={artDisplayH} fill="#D4933A" opacity={0.35} />
            <rect x={artX} y={artY + artDisplayH - matOverlap * scale} width={artDisplayW} height={matOverlap * scale} fill="#D4933A" opacity={0.35} />
          </>
        )}

        {/* Artwork label */}
        <text x={cx} y={cy - 10} textAnchor="middle" className="font-mono" fontSize={14} fontWeight={500} letterSpacing={3} fill="#9A968E">
          ARTWORK
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="font-mono" fontSize={12} letterSpacing={2} fill="#9A968E">
          {artWidth}&quot; &times; {artHeight}&quot;
        </text>

        {/* Outer dimension lines */}
        {/* Horizontal top */}
        <line x1={fx} y1={fy - dimGap} x2={fx + frameW} y2={fy - dimGap} stroke="#C25B56" />
        <line x1={fx} y1={fy - dimGap - tickLen / 2} x2={fx} y2={fy - dimGap + tickLen / 2} stroke="#C25B56" />
        <line x1={fx + frameW} y1={fy - dimGap - tickLen / 2} x2={fx + frameW} y2={fy - dimGap + tickLen / 2} stroke="#C25B56" />
        <text x={cx} y={fy - dimGap - 8} textAnchor="middle" className="font-mono" fontSize={10} fontWeight={500} fill="#C25B56">
          {formatFraction(outerWidth)}&quot;
        </text>

        {/* Vertical left */}
        <line x1={fx - dimGap} y1={fy} x2={fx - dimGap} y2={fy + frameH} stroke="#C25B56" />
        <line x1={fx - dimGap - tickLen / 2} y1={fy} x2={fx - dimGap + tickLen / 2} y2={fy} stroke="#C25B56" />
        <line x1={fx - dimGap - tickLen / 2} y1={fy + frameH} x2={fx - dimGap + tickLen / 2} y2={fy + frameH} stroke="#C25B56" />
        <text x={fx - dimGap - 12} y={cy + 4} textAnchor="middle" className="font-mono" fontSize={12} fontWeight={500} fill="#C25B56" transform={`rotate(-90, ${fx - dimGap - 12}, ${cy + 4})`}>
          {formatFraction(outerHeight)}&quot;
        </text>

        {/* Horizontal bottom - outer width */}
        <line x1={fx} y1={fy + frameH + dimGap} x2={fx + frameW} y2={fy + frameH + dimGap} stroke="#C25B56" />
        <line x1={fx} y1={fy + frameH + dimGap - tickLen / 2} x2={fx} y2={fy + frameH + dimGap + tickLen / 2} stroke="#C25B56" />
        <line x1={fx + frameW} y1={fy + frameH + dimGap - tickLen / 2} x2={fx + frameW} y2={fy + frameH + dimGap + tickLen / 2} stroke="#C25B56" />
        <text x={cx} y={fy + frameH + dimGap + 18} textAnchor="middle" className="font-mono" fontSize={12} fontWeight={500} fill="#C25B56">
          {formatFraction(outerWidth)}&quot;
        </text>

        {/* Artwork dimension lines */}
        {/* Horizontal artwork width */}
        <line x1={artX} y1={artY + artDisplayH + 16} x2={artX + artDisplayW} y2={artY + artDisplayH + 16} stroke="#C25B56" strokeWidth={1.75} />
        <line x1={artX} y1={artY + artDisplayH + 10} x2={artX} y2={artY + artDisplayH + 22} stroke="#C25B56" strokeWidth={1.75} />
        <line x1={artX + artDisplayW} y1={artY + artDisplayH + 10} x2={artX + artDisplayW} y2={artY + artDisplayH + 22} stroke="#C25B56" strokeWidth={1.75} />
        <LabelPill
          cx={artX + artDisplayW / 2}
          cy={artY + artDisplayH + 28}
          text={`${artWidth}"`}
          fontSize={10}
          color="#C25B56"
        />

        {/* Vertical artwork height */}
        <line x1={artX + artDisplayW + 16} y1={artY} x2={artX + artDisplayW + 16} y2={artY + artDisplayH} stroke="#C25B56" strokeWidth={1.75} />
        <line x1={artX + artDisplayW + 10} y1={artY} x2={artX + artDisplayW + 22} y2={artY} stroke="#C25B56" strokeWidth={1.75} />
        <line x1={artX + artDisplayW + 10} y1={artY + artDisplayH} x2={artX + artDisplayW + 22} y2={artY + artDisplayH} stroke="#C25B56" strokeWidth={1.75} />
        <LabelPill
          cx={artX + artDisplayW + 32}
          cy={artY + artDisplayH / 2}
          text={`${artHeight}"`}
          fontSize={10}
          color="#C25B56"
          rotate={-90}
        />

        {/* Mat width annotation (right side): from opening edge to mat edge */}
        {matWidth > 0 && (() => {
          const openingTop = artY + matOverlap * scale;
          const midY = (openingTop + matY) / 2;
          return (
            <>
              <line x1={artX + artDisplayW + 55} y1={openingTop} x2={artX + artDisplayW + 55} y2={matY} stroke="#C25B56" strokeWidth={1.75} />
              <line x1={artX + artDisplayW + 49} y1={openingTop} x2={artX + artDisplayW + 61} y2={openingTop} stroke="#C25B56" strokeWidth={1.75} />
              <line x1={artX + artDisplayW + 49} y1={matY} x2={artX + artDisplayW + 61} y2={matY} stroke="#C25B56" strokeWidth={1.75} />
              <LabelPill
                cx={artX + artDisplayW + 85}
                cy={midY - 4}
                text={`${formatFraction(matWidth)}"`}
                fontSize={9}
                color="#C25B56"
                anchor="start"
              />
              <LabelPill
                cx={artX + artDisplayW + 85}
                cy={midY + 8}
                text="MAT"
                fontSize={8}
                color="#6B6860"
                anchor="start"
                letterSpacing={2}
              />
            </>
          );
        })()}

        {/* Frame width annotation */}
        <line x1={artX + artDisplayW + 55} y1={matY} x2={artX + artDisplayW + 55} y2={fy} stroke="#C25B56" strokeWidth={1.75} />
        <line x1={artX + artDisplayW + 49} y1={fy} x2={artX + artDisplayW + 61} y2={fy} stroke="#C25B56" strokeWidth={1.75} />
        <LabelPill
          cx={artX + artDisplayW + 85}
          cy={(matY + fy) / 2 - 4}
          text={`${formatFraction(frameWidth)}"`}
          fontSize={9}
          color="#C25B56"
          anchor="start"
        />
        <LabelPill
          cx={artX + artDisplayW + 85}
          cy={(matY + fy) / 2 + 8}
          text="FRAME"
          fontSize={8}
          color="#6B6860"
          anchor="start"
          letterSpacing={2}
        />

        {/* Mat Overview Box */}
        {(() => {
          // Mat visible outer = opening + 2*matWidth. The board also extends
          // into the frame rabbet on each side, adding 2 * rabbetDepth.
          const matOpenW = artWidth - 2 * matOverlap;
          const matOpenH = artHeight - 2 * matOverlap;
          const matOuterW = matOpenW + 2 * matWidth + 2 * rabbetDepth;
          const matOuterH = matOpenH + 2 * matWidth + 2 * rabbetDepth;

          // Mini mat drawing, scaled to fit within the box
          const drawMax = 110;
          const miniScale = Math.min(drawMax / matOuterW, drawMax / matOuterH);
          const miniW = matOuterW * miniScale;
          const miniH = matOuterH * miniScale;
          const miniX = cdX + cdW / 2 - miniW / 2;
          const miniY = cdY + 48;
          const openW = matOpenW * miniScale;
          const openH = matOpenH * miniScale;
          const openX = miniX + (miniW - openW) / 2;
          const openY = miniY + (miniH - openH) / 2;

          return (
            <>
              <rect x={cdX} y={cdY} width={cdW} height={cdH} rx={2} fill="#FFFFFF" stroke="#D4D0C8" />
              <text x={cdX + 12} y={cdY + 16} className="font-mono" fontSize={10} fontWeight={500} letterSpacing={2} fill="#2C2C2C">
                MAT OVERVIEW
              </text>
              <text x={cdX + 12} y={cdY + 30} className="font-mono" fontSize={9} fill="#9A968E">
                Dimensions for ordering mat board
              </text>

              {/* Mini mat drawing */}
              <rect x={miniX} y={miniY} width={miniW} height={miniH} fill="#F0EDE5" stroke="#D8D4CB" />
              <rect x={openX} y={openY} width={openW} height={openH} fill="#F8F6F1" stroke="#D4933A" strokeDasharray="3 2" />

              {/* Labels */}
              <text x={cdX + 12} y={cdY + cdH - 50} className="font-mono" fontSize={9} fontWeight={500} fill="#6B6860">
                OUTER
              </text>
              <text x={cdX + cdW - 12} y={cdY + cdH - 50} textAnchor="end" className="font-mono" fontSize={10} fontWeight={600} fill="#2C2C2C">
                {formatFraction(matOuterW)}&quot; &times; {formatFraction(matOuterH)}&quot;
              </text>

              <line x1={cdX + 12} y1={cdY + cdH - 40} x2={cdX + cdW - 12} y2={cdY + cdH - 40} stroke="#E0DDD5" />

              <text x={cdX + 12} y={cdY + cdH - 22} className="font-mono" fontSize={9} fontWeight={500} fill="#D4933A">
                OPENING
              </text>
              <text x={cdX + cdW - 12} y={cdY + cdH - 22} textAnchor="end" className="font-mono" fontSize={10} fontWeight={600} fill="#2C2C2C">
                {formatFraction(matOpenW)}&quot; &times; {formatFraction(matOpenH)}&quot;
              </text>
              <text x={cdX + 12} y={cdY + cdH - 10} className="font-mono" fontSize={8} fill="#9A968E">
                Artwork &minus; {formatFraction(matOverlap)}&quot; overlap per side
              </text>
            </>
          );
        })()}

        {/* Glass Overview Box */}
        {(() => {
          // Glass sits in the same rabbet opening as the mat, so it matches
          // the mat board outer dimensions.
          const glassW = artWidth - 2 * matOverlap + 2 * matWidth + 2 * rabbetDepth;
          const glassH = artHeight - 2 * matOverlap + 2 * matWidth + 2 * rabbetDepth;

          // Mini glass drawing
          const drawMax = 70;
          const miniScale = Math.min(drawMax / glassW, drawMax / glassH);
          const miniW = glassW * miniScale;
          const miniH = glassH * miniScale;
          const miniX = gX + gW / 2 - miniW / 2;
          const miniY = gY + 44;

          return (
            <>
              <rect x={gX} y={gY} width={gW} height={gH} rx={2} fill="#FFFFFF" stroke="#D4D0C8" />
              <text x={gX + 12} y={gY + 16} className="font-mono" fontSize={10} fontWeight={500} letterSpacing={2} fill="#2C2C2C">
                GLASS OVERVIEW
              </text>
              <text x={gX + 12} y={gY + 30} className="font-mono" fontSize={9} fill="#9A968E">
                Dimensions for ordering glass panel
              </text>

              {/* Mini glass drawing */}
              <rect x={miniX} y={miniY} width={miniW} height={miniH} fill="#EAF1F5" stroke="#4A6FA5" strokeOpacity={0.5} />
              {/* Shine line */}
              <line x1={miniX + miniW * 0.15} y1={miniY + miniH * 0.15} x2={miniX + miniW * 0.35} y2={miniY + miniH * 0.85} stroke="#FFFFFF" strokeWidth={2} opacity={0.8} />

              {/* Labels */}
              <text x={gX + 12} y={gY + gH - 22} className="font-mono" fontSize={9} fontWeight={500} fill="#4A6FA5">
                SIZE
              </text>
              <text x={gX + gW - 12} y={gY + gH - 22} textAnchor="end" className="font-mono" fontSize={10} fontWeight={600} fill="#2C2C2C">
                {formatFraction(glassW)}&quot; &times; {formatFraction(glassH)}&quot;
              </text>
              <text x={gX + 12} y={gY + gH - 10} className="font-mono" fontSize={8} fill="#9A968E">
                Fits in frame rabbet (same as mat board)
              </text>
            </>
          );
        })()}

      </svg>
    </div>
  );
}

interface LabelPillProps {
  cx: number;
  cy: number;
  text: string;
  fontSize: number;
  color: string;
  anchor?: "start" | "middle" | "end";
  rotate?: number;
  letterSpacing?: number;
}

// Text with a cream background pill so labels stay legible over the
// dark frame color. Width is approximated from character count.
function LabelPill({ cx, cy, text, fontSize, color, anchor = "middle", rotate, letterSpacing = 0 }: LabelPillProps) {
  const charWidth = fontSize * 0.62;
  const textWidth = text.length * charWidth + (text.length - 1) * letterSpacing;
  const padX = 5;
  const padY = 3;
  const rectW = textWidth + 2 * padX;
  const rectH = fontSize + 2 * padY;
  const rectX =
    anchor === "middle" ? cx - rectW / 2 : anchor === "end" ? cx - rectW : cx - padX;
  const rectY = cy - fontSize / 2 - padY + 1;

  const content = (
    <>
      <rect x={rectX} y={rectY} width={rectW} height={rectH} rx={3} fill="#F8F6F1" stroke="#D4D0C8" strokeWidth={0.75} />
      <text
        x={cx}
        y={cy + fontSize / 3}
        textAnchor={anchor}
        className="font-mono"
        fontSize={fontSize}
        fontWeight={500}
        fill={color}
        letterSpacing={letterSpacing}
      >
        {text}
      </text>
    </>
  );

  if (rotate) {
    return <g transform={`rotate(${rotate}, ${cx}, ${cy})`}>{content}</g>;
  }
  return content;
}
