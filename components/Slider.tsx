"use client";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export default function Slider({ value, min, max, step, onChange }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-4 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-input"
        style={{
          background: `linear-gradient(to right, #4A6FA5 0%, #4A6FA5 ${percent}%, #EDEAE3 ${percent}%, #EDEAE3 100%)`,
        }}
      />
    </div>
  );
}
