import React from 'react';
import { 
  TrendingUp, 
  Minus, 
  Square, 
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff,
  Palette
} from 'lucide-react';
import { DrawingLine } from '../types/drawing';

interface DrawingToolbarProps {
  currentTool: DrawingLine['type'] | null;
  onToolSelect: (tool: DrawingLine['type'] | null) => void;
  onClearAll: () => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
}

const DRAWING_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#22c55e', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899', // Pink
  '#ffffff', // White
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  currentTool,
  onToolSelect,
  onClearAll,
  onToggleVisibility,
  isVisible,
  selectedColor,
  onColorChange,
  lineWidth,
  onLineWidthChange,
}) => {
  const tools = [
    { type: 'trendline' as const, icon: TrendingUp, label: 'Trend Line' },
    { type: 'horizontal' as const, icon: Minus, label: 'Horizontal Line' },
    { type: 'rectangle' as const, icon: Square, label: 'Rectangle' },
    { type: 'fibonacci' as const, icon: MoreHorizontal, label: 'Fibonacci' },
  ];

  return (
    <div className="absolute top-4 left-4 z-30 bg-[var(--terciary-bg-color)] rounded-lg p-2 shadow-lg border border-[var(--border-color)]">
      <div className="flex flex-col gap-2">
        {/* Drawing Tools */}
        <div className="flex gap-1">
          {tools.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onToolSelect(currentTool === type ? null : type)}
              className={`p-2 rounded transition-colors ${
                currentTool === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-[var(--secondary-bg-color)] text-[var(--text-color)] hover:bg-[var(--bg-color)]'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 flex-wrap max-w-[120px]">
          {DRAWING_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                selectedColor === color
                  ? 'border-white scale-110'
                  : 'border-gray-600 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          ))}
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-color)]">Width:</span>
          <input
            type="range"
            min="1"
            max="5"
            value={lineWidth}
            onChange={(e) => onLineWidthChange(Number(e.target.value))}
            className="w-16 h-1 bg-[var(--secondary-bg-color)] rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-[var(--text-color)] w-4">{lineWidth}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 pt-2 border-t border-[var(--border-color)]">
          <button
            onClick={onToggleVisibility}
            className="p-2 rounded bg-[var(--secondary-bg-color)] text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors"
            title={isVisible ? 'Hide Drawings' : 'Show Drawings'}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onClearAll}
            className="p-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            title="Clear All Drawings"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};</parameter>