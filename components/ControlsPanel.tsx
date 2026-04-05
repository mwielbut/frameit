"use client";

import { ImageIcon, Square, Maximize2, Frame, Layers, Scissors, Printer, Tag, AlertTriangle } from "lucide-react";
import Slider from "./Slider";
import {
  FrameInputs,
  FrameGeometry,
  InputMode,
  formatFraction,
  formatPair,
} from "../lib/calculations";

interface ControlsPanelProps {
  geo: FrameGeometry;
  onInputChange: <K extends keyof FrameInputs>(key: K, value: FrameInputs[K]) => void;
  onModeChange: (mode: InputMode) => void;
}

// Per-mode copy for the dimension section. Keeps the rest of the component
// oblivious to which dimension is being held fixed.
const MODE_META: Record<
  InputMode,
  { label: string; icon: React.ElementType; inputLabel: string }
> = {
  artwork:    { label: "ARTWORK SIZE",     icon: ImageIcon, inputLabel: "Artwork" },
  frameOuter: { label: "FRAME OUTER SIZE", icon: Frame,     inputLabel: "Frame outer" },
  matBoard:   { label: "MAT BOARD SIZE",   icon: Layers,    inputLabel: "Mat board" },
};

const MODE_ORDER: InputMode[] = ["artwork", "frameOuter", "matBoard"];
const MODE_SHORT: Record<InputMode, string> = {
  artwork: "Artwork",
  frameOuter: "Frame",
  matBoard: "Mat",
};

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

export default function ControlsPanel({ geo, onInputChange, onModeChange }: ControlsPanelProps) {
  const meta = MODE_META[geo.mode];
  const ModeIcon = meta.icon;
  return (
    <div className="w-[380px] min-w-[380px] h-full bg-white border-r border-[#D4D0C8] overflow-y-auto flex flex-col gap-4 px-7 py-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <Frame size={22} color="#4A6FA5" strokeWidth={2.5} />
          <span className="font-mono text-[18px] font-bold tracking-[4px] text-[#2C2C2C]">
            FRAMEIT
          </span>
        </div>
        <p className="text-[13px] text-[#6B6860] leading-[1.4]">
          Calculate wood cut and mat cut dimensions for custom picture frames
        </p>
      </div>

      <Divider />

      {/* Project Name */}
      <div className="flex flex-col gap-2">
        <SectionLabel icon={Tag} label="PROJECT NAME" />
        <div className="flex items-center h-10 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-3">
          <input
            type="text"
            value={geo.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="e.g. Living room landscape"
            maxLength={60}
            className="w-full bg-transparent text-[14px] font-medium text-[#2C2C2C] outline-none placeholder:text-[#9A968E] placeholder:font-normal"
          />
        </div>
        <p className="text-[11px] text-[#9A968E]">Optional label to distinguish this frame from others.</p>
      </div>

      <Divider />

      {/* Input Mode toggle */}
      <div className="flex flex-col gap-2">
        <SectionLabel icon={Maximize2} label="FIXED DIMENSION" />
        <div className="flex items-center rounded border border-[#D4D0C8] bg-[#F8F6F1] p-0.5">
          {MODE_ORDER.map((m) => {
            const active = geo.mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`flex-1 h-8 rounded text-[11px] font-mono font-medium tracking-[1px] transition-colors ${
                  active
                    ? "bg-[#4A6FA5] text-white"
                    : "text-[#6B6860] hover:text-[#2C2C2C]"
                }`}
              >
                {MODE_SHORT[m].toUpperCase()}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#9A968E]">
          Which dimension is pinned. Sliders vary the others around it.
        </p>
      </div>

      <Divider />

      {/* Dimensions (meaning depends on mode) */}
      <div className="flex flex-col gap-2">
        <SectionLabel icon={ModeIcon} label={meta.label} />
        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] text-[#6B6860]">Width</label>
            <div
              className={`flex items-center justify-between h-10 rounded bg-[#F8F6F1] border px-3 ${
                geo.artInvalid ? "border-[#C25B56]" : "border-[#D4D0C8]"
              }`}
            >
              <input
                type="number"
                value={geo.inputWidth}
                onChange={(e) => onInputChange("inputWidth", parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[14px] font-mono font-medium text-[#2C2C2C] outline-none"
              />
              <span className="text-[11px] text-[#9A968E] font-mono ml-1">in</span>
            </div>
          </div>
          <span className="text-[16px] text-[#9A968E] mt-4">&times;</span>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] text-[#6B6860]">Height</label>
            <div
              className={`flex items-center justify-between h-10 rounded bg-[#F8F6F1] border px-3 ${
                geo.artInvalid ? "border-[#C25B56]" : "border-[#D4D0C8]"
              }`}
            >
              <input
                type="number"
                value={geo.inputHeight}
                onChange={(e) => onInputChange("inputHeight", parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[14px] font-mono font-medium text-[#2C2C2C] outline-none"
              />
              <span className="text-[11px] text-[#9A968E] font-mono ml-1">in</span>
            </div>
          </div>
        </div>
        {geo.artInvalid ? (
          <div className="flex items-start gap-1.5 text-[11px] text-[#C25B56]">
            <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
            <span>
              Too small for these mat/frame settings — increase size or reduce mat/frame width.
            </span>
          </div>
        ) : (
          geo.mode !== "artwork" && (
            <p className="text-[11px] text-[#9A968E]">
              Fits artwork: <span className="font-mono text-[#6B6860]">{formatPair(geo.artWidth, geo.artHeight)}</span>
            </p>
          )
        )}
      </div>

      <Divider />

      {/* Mat Width */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Square} label="MAT WIDTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(geo.matWidth)} in
            </span>
          </div>
        </div>
        <Slider value={geo.matWidth} min={0} max={4} step={0.25} onChange={(v) => onInputChange("matWidth", v)} />
        <p className="text-[11px] text-[#9A968E]">Visible border from opening. Range: 0-4 inches</p>
      </div>

      <Divider />

      {/* Mat Overlap */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Maximize2} label="MAT OVERLAP" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(geo.matOverlap)} in
            </span>
          </div>
        </div>
        <Slider value={geo.matOverlap} min={0.125} max={0.5} step={0.125} onChange={(v) => onInputChange("matOverlap", v)} />
        <p className="text-[11px] text-[#9A968E]">How much mat covers artwork edge. Range: 1/8-1/2 in</p>
      </div>

      {/* Frame Width */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Frame} label="FRAME WIDTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(geo.frameWidth)} in
            </span>
          </div>
        </div>
        <Slider value={geo.frameWidth} min={0.5} max={3} step={0.25} onChange={(v) => onInputChange("frameWidth", v)} />
        <p className="text-[11px] text-[#9A968E]">Visible frame border. Range: 0.5-3 inches</p>
      </div>

      <Divider />

      {/* Rabbet Depth */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <SectionLabel icon={Layers} label="RABBET DEPTH" />
          <div className="flex items-center h-7 rounded bg-[#F8F6F1] border border-[#D4D0C8] px-2.5">
            <span className="font-mono text-[12px] font-medium text-[#2C2C2C]">
              {formatFraction(geo.rabbetDepth)} in
            </span>
          </div>
        </div>
        <Slider value={geo.rabbetDepth} min={0.125} max={0.75} step={0.125} onChange={(v) => onInputChange("rabbetDepth", v)} />
        <p className="text-[11px] text-[#9A968E]">Groove depth in frame. Range: 1/8–3/4 inches</p>
      </div>

      <Divider />

      {/* Cut List */}
      <div className="flex flex-col gap-3.5">
        <SectionLabel icon={Scissors} label="CUT LIST" color="#C25B56" />
        <div className="rounded bg-[#F8F6F1] border border-[#D4D0C8] p-4 flex flex-col gap-3">
          <CutGroup
            label="Long sides (&times;2)"
            rough={`${formatFraction(geo.longSideRough)}"`}
            exact={`${formatFraction(geo.longSide)}"`}
          />
          <div className="h-px bg-[#D4D0C8]" />
          <CutGroup
            label="Short sides (&times;2)"
            rough={`${formatFraction(geo.shortSideRough)}"`}
            exact={`${formatFraction(geo.shortSide)}"`}
          />
          <div className="h-px bg-[#D4D0C8]" />
          <CutRow label="Miter angle" value={`${geo.miterAngle}\u00B0`} />
          <div className="h-px bg-[#D4D0C8]" />
          <CutRow label="Outer dimensions" value={formatPair(geo.outerWidth, geo.outerHeight)} />
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#2C2C2C]">Total lumber needed</span>
            <span className="font-mono text-[14px] font-bold text-[#4A6FA5]">
              {formatFraction(geo.totalLumber)}&quot;
            </span>
          </div>
          <p className="text-[10px] text-[#9A968E] leading-[1.4]">
            Rough cut includes {formatFraction(geo.roughCutAllowance)}&quot; extra for waste; trim to exact length with 45&deg; miters.
          </p>
        </div>
      </div>

      {/* Print button */}
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center justify-center gap-2 h-10 rounded bg-[#4A6FA5] hover:bg-[#3d5d8a] transition-colors text-white font-mono text-[12px] font-medium tracking-[2px]"
      >
        <Printer size={14} />
        PRINT CUT SHEET
      </button>
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

function CutGroup({ label, rough, exact }: { label: string; rough: string; exact: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-semibold text-[#2C2C2C]" dangerouslySetInnerHTML={{ __html: label }} />
      <div className="flex items-center justify-between pl-3">
        <span className="text-[12px] text-[#6B6860]">Rough cut</span>
        <span className="font-mono text-[13px] text-[#2C2C2C]">{rough}</span>
      </div>
      <div className="flex items-center justify-between pl-3">
        <span className="text-[12px] text-[#6B6860]">Miter to</span>
        <span className="font-mono text-[13px] font-semibold text-[#2C2C2C]">{exact}</span>
      </div>
    </div>
  );
}
