import { useCallback, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';

export const useChart = () => {
  const chartRef = useRef<IChartApi | null>(null);

  const initializeChart = useCallback((container: HTMLDivElement) => {
    chartRef.current = createChart(container, {
      width: container.clientWidth,
      height: 600,
      layout: {
        background: { color: '#111827' },
        textColor: '#d1d5db',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12,
        rightOffset: 50, // Add space to the right of the chart
        fixLeftEdge: true,
        fixRightEdge: false, // Allow dragging beyond the right edge
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true, // Keep the rightmost bar in view while scrolling
      },
      rightPriceScale: {
        borderColor: '#374151',
        mode: 2,
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6b7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#374151',
        },
        horzLine: {
          color: '#6b7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#374151',
        },
      },
    });

    const handleResize = () => {
      if (chartRef.current && container) {
        const newWidth = container.clientWidth;
        chartRef.current.applyOptions({ 
          width: newWidth,
          timeScale: {
            fixLeftEdge: true,
            fixRightEdge: false,
            rightOffset: 50,
          }
        });
        chartRef.current.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { chartRef, initializeChart };
};