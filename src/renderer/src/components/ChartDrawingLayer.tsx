import React, { useEffect, useRef, useCallback } from 'react';
import { DrawingLine, ChartCoordinate } from '../types/drawing';

interface ChartDrawingLayerProps {
  lines: DrawingLine[];
  tempLine: any;
  isVisible: boolean;
  priceToCoordinate: (point: { time: number; price: number }) => ChartCoordinate | null;
  onLineSelect: (lineId: string | null) => void;
  onLineDelete: (lineId: string) => void;
  selectedLineId: string | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ChartDrawingLayer: React.FC<ChartDrawingLayerProps> = ({
  lines,
  tempLine,
  isVisible,
  priceToCoordinate,
  onLineSelect,
  onLineDelete,
  selectedLineId,
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawLine = useCallback((
    ctx: CanvasRenderingContext2D,
    line: DrawingLine | any,
    isTemp = false
  ) => {
    if (!line.points || line.points.length < 2) return;

    const startCoord = priceToCoordinate(line.points[0]);
    const endCoord = priceToCoordinate(line.points[1]);

    if (!startCoord || !endCoord) return;

    ctx.save();
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.lineWidth;
    ctx.globalAlpha = isTemp ? 0.7 : 1;

    // Set line style
    if (line.lineStyle === 'dashed') {
      ctx.setLineDash([5, 5]);
    } else if (line.lineStyle === 'dotted') {
      ctx.setLineDash([2, 2]);
    }

    ctx.beginPath();

    switch (line.type) {
      case 'trendline':
        ctx.moveTo(startCoord.x, startCoord.y);
        ctx.lineTo(endCoord.x, endCoord.y);
        break;

      case 'horizontal':
        // Draw horizontal line across the entire visible area
        ctx.moveTo(0, startCoord.y);
        ctx.lineTo(ctx.canvas.width, startCoord.y);
        break;

      case 'vertical':
        // Draw vertical line across the entire visible area
        ctx.moveTo(startCoord.x, 0);
        ctx.lineTo(startCoord.x, ctx.canvas.height);
        break;

      case 'rectangle':
        const width = endCoord.x - startCoord.x;
        const height = endCoord.y - startCoord.y;
        ctx.rect(startCoord.x, startCoord.y, width, height);
        break;

      case 'fibonacci':
        // Draw fibonacci retracement levels
        const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const priceRange = line.points[1].price - line.points[0].price;
        
        fibLevels.forEach((level) => {
          const fibPrice = line.points[0].price + (priceRange * level);
          const fibCoord = priceToCoordinate({ time: line.points[0].time, price: fibPrice });
          
          if (fibCoord) {
            ctx.globalAlpha = 0.6;
            ctx.moveTo(0, fibCoord.y);
            ctx.lineTo(ctx.canvas.width, fibCoord.y);
            
            // Draw level label
            ctx.fillStyle = line.color;
            ctx.font = '12px Arial';
            ctx.fillText(`${(level * 100).toFixed(1)}%`, 5, fibCoord.y - 5);
          }
        });
        break;
    }

    ctx.stroke();

    // Draw selection handles for selected lines
    if (!isTemp && line.id === selectedLineId) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      
      // Draw handles at endpoints
      [startCoord, endCoord].forEach((coord) => {
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.restore();
  }, [priceToCoordinate, selectedLineId]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isVisible) return;

    // Draw all lines
    lines.forEach((line) => {
      if (line.isVisible) {
        drawLine(ctx, line);
      }
    });

    // Draw temporary line
    if (tempLine) {
      drawLine(ctx, tempLine, true);
    }
  }, [lines, tempLine, isVisible, drawLine]);

  // Setup canvas and redraw on mount and updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    // Initial setup
    redrawCanvas();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      redrawCanvas();
    });
    
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [redrawCanvas]);

  // Redraw when dependencies change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle canvas click for line selection
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is near any line
    let selectedLine: string | null = null;
    const tolerance = 10; // pixels

    for (const line of lines) {
      if (!line.isVisible) continue;

      const startCoord = priceToCoordinate(line.points[0]);
      const endCoord = priceToCoordinate(line.points[1]);

      if (!startCoord || !endCoord) continue;

      // Calculate distance from point to line
      const distance = distanceToLine(
        { x, y },
        startCoord,
        endCoord
      );

      if (distance <= tolerance) {
        selectedLine = line.id;
        break;
      }
    }

    onLineSelect(selectedLine);

    // Handle double-click for deletion
    if (event.detail === 2 && selectedLine) {
      onLineDelete(selectedLine);
    }
  }, [lines, priceToCoordinate, onLineSelect, onLineDelete]);

  // Calculate distance from point to line segment
  const distanceToLine = (
    point: ChartCoordinate,
    lineStart: ChartCoordinate,
    lineEnd: ChartCoordinate
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);

    let param = dot / lenSq;
    param = Math.max(0, Math.min(1, param));

    const xx = lineStart.x + param * C;
    const yy = lineStart.y + param * D;

    const dx = point.x - xx;
    const dy = point.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 15,
      }}
    />
  );
};</parameter>