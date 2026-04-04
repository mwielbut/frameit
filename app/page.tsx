"use client";

import { useState, useMemo } from "react";
import ControlsPanel from "../components/ControlsPanel";
import FrameDiagram from "../components/FrameDiagram";
import PrintSheet from "../components/PrintSheet";
import { FrameInputs, calculateFrame } from "../lib/calculations";

export default function Home() {
  const [inputs, setInputs] = useState<FrameInputs>({
    artWidth: 16,
    artHeight: 20,
    matWidth: 2.5,
    matOverlap: 0.25,
    frameWidth: 1.5,
    rabbetDepth: 0.375,
  });

  const results = useMemo(() => calculateFrame(inputs), [inputs]);

  const handleInputChange = (key: keyof FrameInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden print:hidden">
        <ControlsPanel inputs={inputs} results={results} onInputChange={handleInputChange} />
        <FrameDiagram inputs={inputs} results={results} />
      </div>
      <PrintSheet inputs={inputs} results={results} />
    </>
  );
}
