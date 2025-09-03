import { useState, useCallback, useRef } from 'react';
import { DrawingState, DrawingLine, DrawingPoint, ChartCoordinate } from '../types/drawing';

export const useDrawing = (chartRef: React.RefObject<any>) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentTool: null,
    lines: [],
    selectedLineId: null,
    dragState: {
      isDragging: false,
      lineId: null,
      pointIndex: null,
      startCoordinate: null,
    },
  });

  const [drawingSettings, setDrawingSettings] = useState({
    color: '#3b82f6',
    lineWidth: 2,
    lineStyle: 'solid' as const,
    isVisible: true,
  });

  const tempLineRef = useRef<DrawingPoint[]>([]);

  // Convert chart coordinates to price/time
  const coordinateToPrice = useCallback((coordinate: ChartCoordinate): DrawingPoint | null => {
    if (!chartRef.current) return null;

    try {
      const timeScale = chartRef.current.timeScale();
      const priceScale = chartRef.current.priceScale('right');
      
      const time = timeScale.coordinateToTime(coordinate.x);
      const price = priceScale.coordinateToPrice(coordinate.y);
      
      if (time === null || price === null) return null;
      
      return { time: time as number, price };
    } catch (error) {
      console.error('Error converting coordinate to price:', error);
      return null;
    }
  }, [chartRef]);

  // Convert price/time to chart coordinates
  const priceToCoordinate = useCallback((point: DrawingPoint): ChartCoordinate | null => {
    if (!chartRef.current) return null;

    try {
      const timeScale = chartRef.current.timeScale();
      const priceScale = chartRef.current.priceScale('right');
      
      const x = timeScale.timeToCoordinate(point.time);
      const y = priceScale.priceToCoordinate(point.price);
      
      if (x === null || y === null) return null;
      
      return { x, y };
    } catch (error) {
      console.error('Error converting price to coordinate:', error);
      return null;
    }
  }, [chartRef]);

  // Start drawing
  const startDrawing = useCallback((coordinate: ChartCoordinate) => {
    if (!drawingState.currentTool) return;

    const point = coordinateToPrice(coordinate);
    if (!point) return;

    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
    }));

    tempLineRef.current = [point];
  }, [drawingState.currentTool, coordinateToPrice]);

  // Update drawing
  const updateDrawing = useCallback((coordinate: ChartCoordinate) => {
    if (!drawingState.isDrawing || !drawingState.currentTool) return;

    const point = coordinateToPrice(coordinate);
    if (!point) return;

    if (drawingState.currentTool === 'horizontal') {
      // For horizontal lines, keep the same price but update time
      tempLineRef.current = [
        tempLineRef.current[0],
        { time: point.time, price: tempLineRef.current[0].price }
      ];
    } else {
      // For other tools, use the actual point
      tempLineRef.current = [tempLineRef.current[0], point];
    }
  }, [drawingState.isDrawing, drawingState.currentTool, coordinateToPrice]);

  // Finish drawing
  const finishDrawing = useCallback(() => {
    if (!drawingState.isDrawing || !drawingState.currentTool || tempLineRef.current.length < 2) {
      setDrawingState(prev => ({ ...prev, isDrawing: false }));
      tempLineRef.current = [];
      return;
    }

    const newLine: DrawingLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: drawingState.currentTool,
      points: [...tempLineRef.current],
      color: drawingSettings.color,
      lineWidth: drawingSettings.lineWidth,
      lineStyle: drawingSettings.lineStyle,
      isSelected: false,
      isVisible: true,
    };

    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      lines: [...prev.lines, newLine],
    }));

    tempLineRef.current = [];
  }, [drawingState.isDrawing, drawingState.currentTool, drawingSettings]);

  // Select tool
  const selectTool = useCallback((tool: DrawingLine['type'] | null) => {
    setDrawingState(prev => ({
      ...prev,
      currentTool: tool,
      isDrawing: false,
      selectedLineId: null,
    }));
    tempLineRef.current = [];
  }, []);

  // Delete line
  const deleteLine = useCallback((lineId: string) => {
    setDrawingState(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== lineId),
      selectedLineId: prev.selectedLineId === lineId ? null : prev.selectedLineId,
    }));
  }, []);

  // Clear all lines
  const clearAllLines = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      lines: [],
      selectedLineId: null,
      isDrawing: false,
    }));
    tempLineRef.current = [];
  }, []);

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setDrawingSettings(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  // Update drawing settings
  const updateDrawingSettings = useCallback((settings: Partial<typeof drawingSettings>) => {
    setDrawingSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Get current temp line for rendering
  const getCurrentTempLine = useCallback(() => {
    if (!drawingState.isDrawing || tempLineRef.current.length === 0) return null;
    
    return {
      type: drawingState.currentTool!,
      points: tempLineRef.current,
      color: drawingSettings.color,
      lineWidth: drawingSettings.lineWidth,
      lineStyle: drawingSettings.lineStyle,
    };
  }, [drawingState.isDrawing, drawingState.currentTool, drawingSettings]);

  return {
    drawingState,
    drawingSettings,
    startDrawing,
    updateDrawing,
    finishDrawing,
    selectTool,
    deleteLine,
    clearAllLines,
    toggleVisibility,
    updateDrawingSettings,
    priceToCoordinate,
    coordinateToPrice,
    getCurrentTempLine,
  };
};</parameter>