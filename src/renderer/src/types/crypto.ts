export type CandleData = {
  volume: any;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type CryptoAsset = {
  [x: string]: any;
  symbol: string
}