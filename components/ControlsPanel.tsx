"use client";

import { Ruler, ImageIcon, Square, Maximize2, Frame, Layers, Scissors } from "lucide-react";
import Slider from "./Slider";
import { FrameInputs, FrameResults, formatFraction } from "../lib/calculations";

interface ControlsPanelProps {
  inputs: FrameInputs;
  results: FrameResults;
  onInputChange: (key: keyof FrameInputs, value: number) => void;
}

function SectionLabel({ icon: Icon, label, color = "#4A6FA5" }: { icon: React.ElementType; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} color={color} />
      <span className="font-mono text-[10px] font-medium tracking-[2px]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#D4D0C8]" />;
}

export default function ControlsPanel({ inputs, results, onInputChange }: ControlsPanelProps) {
  return (
    <div className="w-[380px] min-w-[380px] h-full bg-white border-r border-[#D4D0C8] overflow-y-auto flex flex-col gap-6 px-7 py-8">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <Frame size={22} color="#4A6FA5" strokeWidth={2.5} />
          <span className="font-mono text-[18px] font-bold tracking-[4px] text-[#2C2C2C]">
            FRAMEIT
          </span>
        </div>
        <p className="text-[13px] text-[#6B6860] leading-[1.4]">
          Calculate wood cut dimensions for custom picture frames
        </p>
      </div>

      <Divider />

      {/* Artwork Size */}
      <div className="flex flex-col gap-3">
        <SectionLabel icon={ImageIcon} label="ARTWORK SIZE" />
        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] text-[#6B6860]">Width</label>
            <div className="flex items-center justify-between h-10 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-3">
              <input
                type="number"
                value={inputs.artWidth}
                onChange={(e) => onInputChange("artWidth", parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[14px] font-mono font-medium text-[#2C2C2C] outline-none"
              />
              <span className="text-[11px] text-[#9A968E] font-mono ml-1">in</span>
            </div>
          </div>
          <span className="text-[16px] text-[#9A968E] mt-4">&times;</span>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] text-[#6B6860]">Height</label>
            <div className="flex items-center justify-between h-10 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-3">
              <input
                type="number"
                value={inputs.artHeight}
                onChange={(e) => onInputChange("artHeight", parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[14px] font-mono font-medium text-[#2C2C2C] outline-none"
              />
              <span className="text-[11px] text-[#9A968E] font-mono ml-1">in</span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Mat Width */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Square} label="MAT WIDTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(inputs.matWidth)} in
            </span>
          </div>
        </div>
        <Slider value={inputs.matWidth} min={0} max={4} step={0.25} onChange={(v) => onInputChange("matWidth", v)} />
        <p className="text-[11px] text-[#9A968E]">Visible border from opening. Range: 0-4 inches</p>
      </div>

      <Divider />

      {/* Mat Overlap */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Maximize2} label="MAT OVERLAP" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(inputs.matOverlap)} in
            </span>
          </div>
        </div>
        <Slider value={inputs.matOverlap} min={0.125} max={0.5} step={0.125} onChange={(v) => onInputChange("matOverlap", v)} />
        <p className="text-[11px] text-[#9A968E]">How much mat covers artwork edge. Range: 1/8-1/2 in</p>
      </div>

      {/* Frame Width */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Frame} label="FRAME WIDTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(inputs.frameWidth)} in
            </span>
          </div>
        </div>
        <Slider value={inputs.frameWidth} min={0.5} max={3} step={0.25} onChange={(v) => onInputChange("frameWidth", v)} />
        <p className="text-[11px] text-[#9A968E]">Visible frame border. Range: 0.5-3 inches</p>
      </div>

      <Divider />

      {/* Rabbet Depth */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Layers} label="RABBET DEPTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(inputs.rabbetDepth)} in
            </span>
          </div>
        </div>
        <Slider value={inputs.rabbetDepth} min={0.125} max={0.75} step={0.125} onChange={(v) => onInputChange("rabbetDepth", v)} />
        <p className="text-[11px] text-[#9A968E]">Groove depth in frame. Range: 1/8–3/4 inches</p>
      </div>

      <Divider />

      {/* Cut List */}
      <div className="flex flex-col gap-3.5">
        <SectionLabel icon={Scissors} label="CUT LIST" color="#C25B56" />
        <div className="rounded bg-[#F8F6F1] border border-[#D4D0C8] p-4 flex flex-col gap-3">
          <CutRow label="Long sides (&times;2)" value={`${formatFraction(results.longSide)}"`} />
          <div className="h-px bg-[#D4D0C8]" />
          <CutRow label="Short sides (&times;2)" value={`${formatFraction(results.shortSide)}"`} />
          <div className="h-px bg-[#D4D0C8]" />
          <CutRow label="Miter angle" value={`${results.miterAngle}\u00B0`} />
          <div className="h-px bg-[#D4D0C8]" />
          <CutRow label="Outer dimensions" value={`${formatFraction(results.outerWidth)}" \u00D7 ${formatFraction(results.outerHeight)}"`} />
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#2C2C2C]">Total lumber needed</span>
            <span className="font-mono text-[14px] font-bold text-[#4A6FA5]">
              {formatFraction(results.totalLumber)}&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-2">
        <span className="font-mono text-[9px] text-[#9A968E] tracking-[0.5px]">
          All measurements include {formatFraction(inputs.rabbetDepth)}&quot; rabbet allowance
        </span>
      </div>
    </div>
  );
}

function CutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#6B6860]" dangerouslySetInnerHTML={{ __html: label }} />
      <span className="font-mono text-[14px] font-semibold text-[#2C2C2C]">{value}</span>
    </div>
  );
}
