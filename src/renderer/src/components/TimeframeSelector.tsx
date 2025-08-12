import React from "react";

interface TimeframeSelectorProps {
  selected: string;
  onChange: (timeframe: string) => void;
}

export function TimeframeSelector({
  selected,
  onChange,
}: TimeframeSelectorProps) {
  const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '1D', value: '1d' },
  ];

  return (
    <div className="no-wrap overflow-hidden items-center gap-2 w-full text-center">
      {timeframes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`rounded-md text-sm px-2 transition-colors ${
            selected === value
              ? ''
              : ''
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}