"use client";

import { FrameGeometry, formatFraction, formatPair } from "../lib/calculations";

interface PrintSheetProps {
  geo: FrameGeometry;
}

export default function PrintSheet({ geo }: PrintSheetProps) {
  const {
    artWidth,
    artHeight,
    matWidth,
    matOverlap,
    frameWidth,
    rabbetDepth,
    longSide,
    shortSide,
    longSideRough,
    shortSideRough,
    roughCutAllowance,
    outerWidth,
    outerHeight,
    totalLumber,
    matOpeningWidth,
    matOpeningHeight,
    matBoardWidth,
    matBoardHeight,
    glassWidth,
    glassHeight,
  } = geo;

  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mini schematic dimensions
  const svgW = 360;
  const svgH = 320;
  const pad = 40;
  const drawMax = Math.min(svgW - 2 * pad, svgH - 2 * pad);
  const s = Math.min(drawMax / outerWidth, drawMax / outerHeight);
  const fw = outerWidth * s;
  const fh = outerHeight * s;
  const fx = (svgW - fw) / 2;
  const fy = (svgH - fh) / 2;
  const mInset = frameWidth * s;
  const mx = fx + mInset;
  const my = fy + mInset;
  const mw = fw - 2 * mInset;
  const mh = fh - 2 * mInset;
  const oInset = matWidth * s;
  const ox = mx + oInset;
  const oy = my + oInset;
  const ow = mw - 2 * oInset;
  const oh = mh - 2 * oInset;

  return (
    <div className="print-sheet hidden print:block">
      {/* Header */}
      <div className="border-b-2 border-[#2C2C2C] pb-3 mb-5 flex items-end justify-between">
        <div>
          <div className="font-mono text-[22px] font-bold tracking-[5px] text-[#2C2C2C]">FRAMEIT</div>
          <div className="text-[13px] text-[#6B6860] mt-0.5">Picture Frame Cut Sheet</div>
        </div>
        <div className="text-right text-[10px] font-mono text-[#6B6860]">
          <div>GENERATED</div>
          <div className="text-[12px] text-[#2C2C2C]">{date}</div>
        </div>
      </div>

      {/* Specs grid */}
      <SectionTitle>SPECIFICATIONS</SectionTitle>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-5 text-[12px]">
        <Spec label="Artwork" value={formatPair(artWidth, artHeight)} />
        <Spec label="Frame width" value={`${formatFraction(frameWidth)}"`} />
        <Spec label="Mat width (visible)" value={`${formatFraction(matWidth)}"`} />
        <Spec label="Rabbet depth" value={`${formatFraction(rabbetDepth)}"`} />
        <Spec label="Mat overlap" value={`${formatFraction(matOverlap)}"`} />
        <Spec label="Outer frame" value={formatPair(outerWidth, outerHeight)} />
      </div>

      {/* Two-column: cut list + diagram */}
      <div className="grid grid-cols-[1fr_auto] gap-6 mb-5">
        <div>
          <SectionTitle>FRAME CUT LIST</SectionTitle>
          <table className="w-full text-[12px] border-collapse mb-1">
            <tbody>
              <Row label="Long sides (×2) — rough cut" value={`${formatFraction(longSideRough)}"`} />
              <Row label="Long sides (×2) — miter to" value={`${formatFraction(longSide)}"`} strong />
              <Row label="Short sides (×2) — rough cut" value={`${formatFraction(shortSideRough)}"`} />
              <Row label="Short sides (×2) — miter to" value={`${formatFraction(shortSide)}"`} strong />
              <Row label="Miter angle" value="45°" />
              <Row label="Total lumber" value={`${formatFraction(totalLumber)}"`} strong />
            </tbody>
          </table>
          <p className="text-[9px] text-[#9A968E] mb-4 leading-[1.4]">
            Rough cut includes {formatFraction(roughCutAllowance)}&quot; extra per piece for waste; trim to exact length with 45° miters on both ends.
          </p>

          <SectionTitle>MAT BOARD</SectionTitle>
          <table className="w-full text-[12px] border-collapse mb-4">
            <tbody>
              <Row label="Board size (order this)" value={formatPair(matBoardWidth, matBoardHeight)} strong />
              <Row label="Opening (cut this)" value={formatPair(matOpeningWidth, matOpeningHeight)} strong />
              <Row label="Visible border" value={`${formatFraction(matWidth)}" all sides`} />
            </tbody>
          </table>

          <SectionTitle>GLASS PANEL</SectionTitle>
          <table className="w-full text-[12px] border-collapse">
            <tbody>
              <Row label="Panel size (order this)" value={formatPair(glassWidth, glassHeight)} strong />
              <Row label="Note" value="Fits in frame rabbet" />
            </tbody>
          </table>
        </div>

        {/* Schematic */}
        <div className="flex flex-col items-center">
          <SectionTitle>ASSEMBLY</SectionTitle>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="border border-[#D4D0C8]">
            {/* Frame */}
            <rect x={fx} y={fy} width={fw} height={fh} fill="#8B7355" />
            <rect x={fx + 3} y={fy + 3} width={fw - 6} height={fh - 6} fill="#A89070" />
            {/* Mat */}
            <rect x={mx} y={my} width={mw} height={mh} fill="#F0EDE5" stroke="#D8D4CB" />
            {/* Opening */}
            <rect x={ox} y={oy} width={ow} height={oh} fill="#FFFFFF" stroke="#9A968E" strokeDasharray="3 2" />

            {/* Outer width dim */}
            <line x1={fx} y1={fy - 14} x2={fx + fw} y2={fy - 14} stroke="#2C2C2C" />
            <line x1={fx} y1={fy - 18} x2={fx} y2={fy - 10} stroke="#2C2C2C" />
            <line x1={fx + fw} y1={fy - 18} x2={fx + fw} y2={fy - 10} stroke="#2C2C2C" />
            <text x={fx + fw / 2} y={fy - 20} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#2C2C2C">
              {formatFraction(outerWidth)}&quot;
            </text>

            {/* Outer height dim */}
            <line x1={fx - 14} y1={fy} x2={fx - 14} y2={fy + fh} stroke="#2C2C2C" />
            <line x1={fx - 18} y1={fy} x2={fx - 10} y2={fy} stroke="#2C2C2C" />
            <line x1={fx - 18} y1={fy + fh} x2={fx - 10} y2={fy + fh} stroke="#2C2C2C" />
            <text x={fx - 20} y={fy + fh / 2} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#2C2C2C" transform={`rotate(-90, ${fx - 20}, ${fy + fh / 2})`}>
              {formatFraction(outerHeight)}&quot;
            </text>
          </svg>
          <div className="mt-2 text-[9px] font-mono text-[#6B6860] text-center">
            Scale: proportional<br />Dashed line = mat opening
          </div>
        </div>
      </div>

      {/* Notes */}
      <SectionTitle>NOTES</SectionTitle>
      <ul className="text-[11px] text-[#6B6860] list-disc pl-5 space-y-0.5">
        <li>All frame pieces cut at 45° miter, measured on the long (outer) edge.</li>
        <li>Mat board size includes {formatFraction(rabbetDepth)}&quot; rabbet allowance on each side (extends behind frame lip).</li>
        <li>Mat opening is {formatFraction(matOverlap)}&quot; smaller than the artwork on each side, so the mat overlaps the artwork edge.</li>
      </ul>

      <div className="mt-6 pt-3 border-t border-[#D4D0C8] text-[9px] font-mono text-[#9A968E] text-center tracking-[1px]">
        GENERATED BY FRAMEIT · ALL DIMENSIONS IN INCHES
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] font-semibold tracking-[2px] text-[#4A6FA5] mb-2">
      {children}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dotted border-[#D4D0C8] pb-1">
      <span className="text-[#6B6860]">{label}</span>
      <span className="font-mono font-semibold text-[#2C2C2C]">{value}</span>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr className="border-b border-[#D4D0C8]">
      <td className="py-1.5 text-[#6B6860]">{label}</td>
      <td className={`py-1.5 text-right font-mono ${strong ? "font-bold text-[#2C2C2C]" : "font-semibold text-[#2C2C2C]"}`}>
        {value}
      </td>
    </tr>
  );
}
