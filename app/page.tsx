"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ControlsPanel from "../components/ControlsPanel";
import FrameDiagram from "../components/FrameDiagram";
import PrintSheet from "../components/PrintSheet";
import { FrameInputs, InputMode, frameGeometry, switchMode } from "../lib/calculations";

const STORAGE_KEY = "frameit:inputs:v2";
const LEGACY_STORAGE_KEY_V1 = "frameit:inputs:v1";

const DEFAULT_INPUTS: FrameInputs = {
  name: "",
  mode: "artwork",
  inputWidth: 16,
  inputHeight: 20,
  matWidth: 2.5,
  matOverlap: 0.25,
  frameWidth: 1.5,
  rabbetDepth: 0.375,
};

// Shape of the pre-modes localStorage entry, so we can migrate cleanly.
interface LegacyV1Inputs {
  name?: string;
  artWidth?: number;
  artHeight?: number;
  matWidth?: number;
  matOverlap?: number;
  frameWidth?: number;
  rabbetDepth?: number;
}

function migrateV1(v1: LegacyV1Inputs): FrameInputs {
  return {
    ...DEFAULT_INPUTS,
    name: v1.name ?? DEFAULT_INPUTS.name,
    mode: "artwork",
    inputWidth: v1.artWidth ?? DEFAULT_INPUTS.inputWidth,
    inputHeight: v1.artHeight ?? DEFAULT_INPUTS.inputHeight,
    matWidth: v1.matWidth ?? DEFAULT_INPUTS.matWidth,
    matOverlap: v1.matOverlap ?? DEFAULT_INPUTS.matOverlap,
    frameWidth: v1.frameWidth ?? DEFAULT_INPUTS.frameWidth,
    rabbetDepth: v1.rabbetDepth ?? DEFAULT_INPUTS.rabbetDepth,
  };
}

export default function Home() {
  const [inputs, setInputs] = useState<FrameInputs>(DEFAULT_INPUTS);
  const hydrated = useRef(false);

  // Load persisted inputs on mount. Deferred to an effect so the static
  // export's pre-rendered HTML matches the first client render.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FrameInputs>;
        setInputs((prev) => ({ ...prev, ...parsed }));
      } else {
        // Fall back to legacy v1 storage (pre input-modes feature) and migrate.
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
        if (legacy) {
          const parsed = JSON.parse(legacy) as LegacyV1Inputs;
          setInputs(migrateV1(parsed));
          localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
        }
      }
    } catch {
      // Ignore malformed storage; fall back to defaults.
    }
    hydrated.current = true;
  }, []);

  // Persist on change, but only after the initial hydration read so we don't
  // overwrite stored values with the defaults on first render.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // Ignore quota/availability errors.
    }
  }, [inputs]);

  const geo = useMemo(() => frameGeometry(inputs), [inputs]);

  const handleInputChange = <K extends keyof FrameInputs>(key: K, value: FrameInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (mode: InputMode) => {
    setInputs((prev) => switchMode(prev, mode));
  };

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden print:hidden">
        <ControlsPanel
          geo={geo}
          onInputChange={handleInputChange}
          onModeChange={handleModeChange}
        />
        <FrameDiagram geo={geo} />
      </div>
      <PrintSheet geo={geo} />
    </>
  );
}
