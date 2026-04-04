"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ControlsPanel from "../components/ControlsPanel";
import FrameDiagram from "../components/FrameDiagram";
import PrintSheet from "../components/PrintSheet";
import { FrameInputs, frameGeometry } from "../lib/calculations";

const STORAGE_KEY = "frameit:inputs:v1";

const DEFAULT_INPUTS: FrameInputs = {
  name: "",
  artWidth: 16,
  artHeight: 20,
  matWidth: 2.5,
  matOverlap: 0.25,
  frameWidth: 1.5,
  rabbetDepth: 0.375,
};

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

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden print:hidden">
        <ControlsPanel geo={geo} onInputChange={handleInputChange} />
        <FrameDiagram geo={geo} />
      </div>
      <PrintSheet geo={geo} />
    </>
  );
}
