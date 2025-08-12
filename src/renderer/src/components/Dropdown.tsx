import React from "react";

interface DropdownProps {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  titleClassName?: string;
}

export function Dropdown({ title, options, value, onChange, titleClassName }: DropdownProps) {
  return (
    <div className="flex items-center mx-3 gap-2 text-sm">
      <span className="">{title}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-1 appearance-none outline-none focus:ring-0 bg-[var(--bg-color)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
