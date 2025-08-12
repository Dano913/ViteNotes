export type OrderLevel = {
  price: string;
  quantity: string;
};

export type OrderbookData = {
  bids: OrderLevel[];
  asks: OrderLevel[];
  midPrice: string;
};

export type AggregationLevel = '0.01' | '0.1' | '1' | '10' | '100';
export type PrecisionLevel = '0' | '1' | '2' | '3' | '4';
export type TradingPair = 'BTCUSDT' | 'ETHUSDT' | 'BNBUSDT' | 'ADAUSDT' | 'DOGEUSDT';

export type Dropdown = {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  titleClassName?: string; // Añadir esta línea
}