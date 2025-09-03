export interface DrawingPoint {
  time: number;
  price: number;
}

export interface DrawingLine {
  id: string;
  type: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'fibonacci';
  points: DrawingPoint[];
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  isSelected: boolean;
  isVisible: boolean;
}

export interface DrawingState {
  isDrawing: boolean;
  currentTool: DrawingLine['type'] | null;
  lines: DrawingLine[];
  selectedLineId: string | null;
  dragState: {
    isDragging: boolean;
    lineId: string | null;
    pointIndex: number | null;
    startCoordinate: { x: number; y: number } | null;
  };
}

export interface ChartCoordinate {
  x: number;
  y: number;
}

export interface PriceTimeCoordinate {
  time: number;
  price: number;
}</parameter>