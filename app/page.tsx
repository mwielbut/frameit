"use client";

import { useState, useMemo } from "react";
import ControlsPanel from "../components/ControlsPanel";
import FrameDiagram from "../components/FrameDiagram";
import PrintSheet from "../components/PrintSheet";
import { FrameInputs, frameGeometry } from "../lib/calculations";

export default function Home() {
  const [inputs, setInputs] = useState<FrameInputs>({
    name: "",
    artWidth: 16,
    artHeight: 20,
    matWidth: 2.5,
    matOverlap: 0.25,
    frameWidth: 1.5,
    rabbetDepth: 0.375,
  });

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
