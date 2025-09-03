import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { CandleData } from '../types/crypto';
import { FaExpand, FaCompress } from 'react-icons/fa';
import { DrawingToolbar } from './DrawingToolbar';
import { ChartDrawingLayer } from './ChartDrawingLayer';
import { useDrawing } from '../hooks/useDrawing';

interface Props {
  data: CandleData[];
}

const calculateMovingAverage = (data: CandleData[], period: number) => {
  let sum = 0;
  return data.map((item, index) => {
    sum += item.close;
    if (index >= period) {
      sum -= data[index - period].close;
    }
    return {
      time: item.time,
      value: index >= period - 1 ? sum / period : null,
    };
  }).filter(item => item.value !== null);
}

export const CandlestickChart: React.FC<Props> = ({ data }) => {
  const [isExpanded] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ma25SeriesRef = useRef<any>(null);
  const ma99SeriesRef = useRef<any>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const {
    canvasRef,
    drawingState,
    drawingSettings,
    setDrawingSettings,
    redrawCanvas,
    handleCanvasClick,
  } = useDrawing(chartRef);

  const {
    startDrawing,
    updateDrawing,
    finishDrawing,
    selectTool,
    deleteLine,
    clearAllLines,
    toggleVisibility,
    getCurrentTempLine,
  } = useDrawing(chartRef);

  const handleResize = () => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
      // Redraw drawings after resize
      setTimeout(redrawCanvas, 100);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-color')
      .trim();

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' }, // Fondo transparente
        textColor: '#fff',
        fontSize: 10,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0,
        bottom: 0,
      },
    });

    ma25SeriesRef.current = chartRef.current.addLineSeries({
      color: '#e91e63',
      lineWidth: 2,
    });

    ma99SeriesRef.current = chartRef.current.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
    });

    candlestickSeriesRef.current.setData(data);
    volumeSeriesRef.current.setData(data.map(d => ({ time: d.time, value: d.volume, color: d.close > d.open ? '#22c55e' : '#ef4444' })));
    ma25SeriesRef.current.setData(calculateMovingAverage(data, 25));
    ma99SeriesRef.current.setData(calculateMovingAverage(data, 99));

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    const sidebarObserver = new MutationObserver(() => {
      handleResize();
      setTimeout(handleResize, 300); // Forzar actualización después de un breve retraso
    });
    sidebarObserver.observe(document.body, {
    // Redraw drawings when data updates
    setTimeout(redrawCanvas, 100);
      attributes: true,
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const newTextColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color')
        .trim();

      chartRef.current.applyOptions({
        layout: {
          textColor: newTextColor,
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
        },
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Handle chart interactions for drawing
    const handleChartClick = (param: any) => {
      if (!drawingState.currentTool || !chartContainerRef.current) return;

      const rect = chartContainerRef.current.getBoundingClientRect();
      const coordinate = {
        x: param.point?.x || 0,
        y: param.point?.y || 0,
      };

      if (!drawingState.isDrawing) {
        startDrawing(coordinate);
      } else {
        finishDrawing();
      }
    };

    const handleChartMouseMove = (param: any) => {
      if (!drawingState.isDrawing || !chartContainerRef.current) return;

      const coordinate = {
        x: param.point?.x || 0,
        y: param.point?.y || 0,
      };

      updateDrawing(coordinate);
      redrawCanvas();
    };

    if (chartRef.current) {
      chartRef.current.subscribeClick(handleChartClick);
      chartRef.current.subscribeCrosshairMove(handleChartMouseMove);
    }
    return () => {
      resizeObserver.disconnect();
      sidebarObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
      observer.disconnect();
      if (chartRef.current) {
        chartRef.current.unsubscribeClick(handleChartClick);
        chartRef.current.unsubscribeCrosshairMove(handleChartMouseMove);
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange();
      const isAutoScroll = chartRef.current.timeScale().scrollPosition() === 0;
      candlestickSeriesRef.current.setData(data);
      volumeSeriesRef.current.setData(data.map(d => ({ time: d.time, value: d.volume, color: d.close > d.open ? '#22c55e' : '#ef4444' })));
      ma25SeriesRef.current.setData(calculateMovingAverage(data, 25));
      ma99SeriesRef.current.setData(calculateMovingAverage(data, 99));
      if (!isAutoScroll) {
        chartRef.current.timeScale().setVisibleLogicalRange(logicalRange);
      }

      if (data.length > 0) {
        const latestCandle = data[data.length - 1];
        setPreviousPrice(currentPrice);
        setCurrentPrice(latestCandle.close);
      }
    }
  }, [data]);

  // Handle drawing tool selection
  const handleToolSelect = (tool: any) => {
    selectTool(tool);
    setIsDrawingMode(!!tool);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setDrawingSettings({ color });
  };

  // Handle line width change
  const handleLineWidthChange = (lineWidth: number) => {
    setDrawingSettings({ lineWidth });
  };
  const priceColor = currentPrice > previousPrice ? 'green' : 'red';
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <div style={{ position: 'relative', width: '99.2%', height: isExpanded ? '100vh' : '450px' }}>
      {/* Drawing Toolbar */}
      <DrawingToolbar
        currentTool={drawingState.currentTool}
        onToolSelect={handleToolSelect}
        onClearAll={clearAllLines}
        onToggleVisibility={toggleVisibility}
        isVisible={drawingSettings.isVisible}
        selectedColor={drawingSettings.color}
        onColorChange={handleColorChange}
        lineWidth={drawingSettings.lineWidth}
        onLineWidthChange={handleLineWidthChange}
      />

      <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: 2, right: 20, zIndex: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
        {isExpanded ? <FaCompress className={`h-6 w-6 ${theme === 'dark' ? 'icon-dark' : 'icon-light'}`} /> : <FaExpand className={`h-4 w-4 ${theme === 'dark' ? 'icon-dark' : 'icon-light'}`} />}
      </button>

      <div
        ref={chartContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          right: -10,
          width: '100%',
          height: '100%',
          transition: 'height 0.3s ease, width 0.3s ease',
          zIndex: 10,
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      />

      {/* Drawing Layer */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          position: 'absolute',
          top: 0,
          right: -10,
          width: '100%',
          height: '100%',
          pointerEvents: isDrawingMode ? 'auto' : 'none',
          zIndex: 15,
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      />

      <ChartDrawingLayer
        lines={drawingState.lines}
        tempLine={getCurrentTempLine()}
        isVisible={drawingSettings.isVisible}
        priceToCoordinate={(point) => {
          if (!chartRef.current) return null;
          try {
            const timeScale = chartRef.current.timeScale();
            const priceScale = chartRef.current.priceScale('right');
            const x = timeScale.timeToCoordinate(point.time);
            const y = priceScale.priceToCoordinate(point.price);
            return x !== null && y !== null ? { x, y } : null;
          } catch {
            return null;
          }
        }}
        onLineSelect={(lineId) => {
          // Handle line selection logic here
        }}
        onLineDelete={deleteLine}
        selectedLineId={drawingState.selectedLineId}
        containerRef={chartContainerRef}
      />

      <div className={`${currentPrice > previousPrice ? 'text-[var(--secondary-text-color)]' : 'text-[var(--terciary-text-color)]'} bg-[var(--bg-color)] px-4`} style={{ position: 'absolute', top: 10, right: 70, zIndex: 10, color: priceColor, fontSize: '20px', fontFamily: 'Roboto, sans-serif' }}>
        ${currentPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default CandlestickChart;
