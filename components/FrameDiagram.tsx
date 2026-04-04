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

  // Artwork sits centered within the mat
  const artDisplayW = artWidth * scale;
  const artDisplayH = artHeight * scale;
  const artX = matX + matWidth * scale;
  const artY = matY + matWidth * scale;

  // Dimension line positions
  const dimGap = 30;
  const tickLen = 13;

  // Corner detail box
  const cdX = 760;
  const cdY = 130;
  const cdW = 250;
  const cdH = 220;

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
          {outerWidth.toFixed(0)}&quot;
        </text>

        {/* Vertical left */}
        <line x1={fx - dimGap} y1={fy} x2={fx - dimGap} y2={fy + frameH} stroke="#C25B56" />
        <line x1={fx - dimGap - tickLen / 2} y1={fy} x2={fx - dimGap + tickLen / 2} y2={fy} stroke="#C25B56" />
        <line x1={fx - dimGap - tickLen / 2} y1={fy + frameH} x2={fx - dimGap + tickLen / 2} y2={fy + frameH} stroke="#C25B56" />
        <text x={fx - dimGap - 12} y={cy + 4} textAnchor="middle" className="font-mono" fontSize={12} fontWeight={500} fill="#C25B56" transform={`rotate(-90, ${fx - dimGap - 12}, ${cy + 4})`}>
          {outerHeight.toFixed(0)}&quot;
        </text>

        {/* Horizontal bottom - outer width */}
        <line x1={fx} y1={fy + frameH + dimGap} x2={fx + frameW} y2={fy + frameH + dimGap} stroke="#C25B56" />
        <line x1={fx} y1={fy + frameH + dimGap - tickLen / 2} x2={fx} y2={fy + frameH + dimGap + tickLen / 2} stroke="#C25B56" />
        <line x1={fx + frameW} y1={fy + frameH + dimGap - tickLen / 2} x2={fx + frameW} y2={fy + frameH + dimGap + tickLen / 2} stroke="#C25B56" />
        <text x={cx} y={fy + frameH + dimGap + 18} textAnchor="middle" className="font-mono" fontSize={12} fontWeight={500} fill="#C25B56">
          {outerWidth.toFixed(0)}&quot;
        </text>

        {/* Artwork dimension lines */}
        {/* Horizontal artwork width */}
        <line x1={artX} y1={artY + artDisplayH + 16} x2={artX + artDisplayW} y2={artY + artDisplayH + 16} stroke="#C25B56" opacity={0.7} />
        <line x1={artX} y1={artY + artDisplayH + 10} x2={artX} y2={artY + artDisplayH + 22} stroke="#C25B56" opacity={0.7} />
        <line x1={artX + artDisplayW} y1={artY + artDisplayH + 10} x2={artX + artDisplayW} y2={artY + artDisplayH + 22} stroke="#C25B56" opacity={0.7} />
        <text x={artX + artDisplayW / 2} y={artY + artDisplayH + 32} textAnchor="middle" className="font-mono" fontSize={10} fill="#C25B56" opacity={0.7}>
          {artWidth}&quot;
        </text>

        {/* Vertical artwork height */}
        <line x1={artX + artDisplayW + 16} y1={artY} x2={artX + artDisplayW + 16} y2={artY + artDisplayH} stroke="#C25B56" opacity={0.7} />
        <line x1={artX + artDisplayW + 10} y1={artY} x2={artX + artDisplayW + 22} y2={artY} stroke="#C25B56" opacity={0.7} />
        <line x1={artX + artDisplayW + 10} y1={artY + artDisplayH} x2={artX + artDisplayW + 22} y2={artY + artDisplayH} stroke="#C25B56" opacity={0.7} />
        <text x={artX + artDisplayW + 32} y={artY + artDisplayH / 2 + 4} textAnchor="middle" className="font-mono" fontSize={10} fill="#C25B56" opacity={0.7} transform={`rotate(-90, ${artX + artDisplayW + 32}, ${artY + artDisplayH / 2 + 4})`}>
          {artHeight}&quot;
        </text>

        {/* Mat width annotation (right side) */}
        {matWidth > 0 && (
          <>
            <line x1={artX + artDisplayW + 55} y1={artY} x2={artX + artDisplayW + 55} y2={matY} stroke="#C25B56" opacity={0.6} />
            <line x1={artX + artDisplayW + 49} y1={artY} x2={artX + artDisplayW + 61} y2={artY} stroke="#C25B56" opacity={0.6} />
            <line x1={artX + artDisplayW + 49} y1={matY} x2={artX + artDisplayW + 61} y2={matY} stroke="#C25B56" opacity={0.6} />
            <text x={artX + artDisplayW + 70} y={(artY + matY) / 2 + 0} className="font-mono" fontSize={9} fill="#C25B56">
              {formatFraction(matWidth)}&quot;
            </text>
            <text x={artX + artDisplayW + 70} y={(artY + matY) / 2 + 12} className="font-mono" fontSize={8} letterSpacing={2} fill="#9A968E">
              MAT
            </text>
          </>
        )}

        {/* Frame width annotation */}
        <line x1={artX + artDisplayW + 55} y1={matY} x2={artX + artDisplayW + 55} y2={fy} stroke="#C25B56" opacity={0.6} />
        <line x1={artX + artDisplayW + 49} y1={fy} x2={artX + artDisplayW + 61} y2={fy} stroke="#C25B56" opacity={0.6} />
        <text x={artX + artDisplayW + 70} y={(matY + fy) / 2 + 0} className="font-mono" fontSize={9} fill="#C25B56">
          {formatFraction(frameWidth)}&quot;
        </text>
        <text x={artX + artDisplayW + 70} y={(matY + fy) / 2 + 12} className="font-mono" fontSize={8} letterSpacing={2} fill="#9A968E">
          FRAME
        </text>

        {/* Corner Detail Box */}
        <rect x={cdX} y={cdY} width={cdW} height={cdH} rx={2} fill="#FFFFFF" stroke="#D4D0C8" />
        <text x={cdX + 12} y={cdY + 16} className="font-mono" fontSize={10} fontWeight={500} letterSpacing={2} fill="#2C2C2C">
          CORNER DETAIL
        </text>
        <text x={cdX + 12} y={cdY + 30} className="font-mono" fontSize={9} fill="#9A968E">
          Cross-section at 45&deg; miter
        </text>

        {/* Corner detail mini drawing */}
        <rect x={cdX + 30} y={cdY + 55} width={80} height={120} rx={1} fill="#8B7355" />
        <rect x={cdX + 38} y={cdY + 63} width={64} height={104} fill="#A89070" />
        <rect x={cdX + 50} y={cdY + 70} width={160} height={95} fill="#F0EDE5" stroke="#D8D4CB" />
        <rect x={cdX + 70} y={cdY + 85} width={140} height={65} fill="#E8E4DB" stroke="#D4D0C8" />

        {/* Overlap highlight in corner detail */}
        <rect x={cdX + 68} y={cdY + 70} width={12} height={95} fill="#D4933A" opacity={0.3} />

        {/* Corner detail annotations */}
        <line x1={cdX + 30} y1={cdY + 175} x2={cdX + 110} y2={cdY + 175} stroke="#C25B56" />
        <text x={cdX + 35} y={cdY + 189} className="font-mono" fontSize={8} fill="#C25B56">
          Rabbet: {formatFraction(rabbetDepth)}&quot; deep
        </text>
        <text x={cdX + 35} y={cdY + 201} className="font-mono" fontSize={8} fill="#9A968E">
          45&deg; miter joint
        </text>
        <text x={cdX + 35} y={cdY + 213} className="font-mono" fontSize={9} fontWeight={500} fill="#D4933A">
          Mat overlap: {formatFraction(matOverlap)}&quot;
        </text>

        {/* Bottom summary line */}
        <line x1={40} y1={vh - 120} x2={vw - 40} y2={vh - 120} stroke="#B8B4AC" />

        <text x={cx} y={vh - 90} textAnchor="middle" className="font-mono" fontSize={13} fontWeight={600} letterSpacing={2} fill="#2C2C2C">
          TOTAL OUTER: {outerWidth.toFixed(0)}&quot; &times; {outerHeight.toFixed(0)}&quot;
        </text>
        <text x={cx} y={vh - 70} textAnchor="middle" className="font-mono" fontSize={9} letterSpacing={1} fill="#6B6860">
          Mat opening: {artWidth}&quot; &times; {artHeight}&quot; | Mat width: {formatFraction(matWidth)}&quot; | Frame: {formatFraction(frameWidth)}&quot;
        </text>

        {/* FIG label */}
        <text x={40} y={vh - 40} className="font-mono" fontSize={11} fontWeight={500} letterSpacing={3} fill="#4A6FA5">
          FIG. 01
        </text>
        <text x={40} y={vh - 24} fontSize={10} fill="#9A968E">
          Frame assembly, top-down cross-section view
        </text>
      </svg>
    </div>
  );
}
