import { ISeriesApi } from 'lightweight-charts';

export type ChartStyle = 'line' | 'candlestick' | 'bar';

export type CryptoSeries = {
  symbol: string;
  series: ISeriesApi<'Line' | 'Candlestick' | 'Histogram'>;
  ws?: WebSocket;
  style: ChartStyle;
  color: string;
  basePrice: number;
  lastKline: KlineData | null;
};

export type KlineData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  startTime: number;
};
