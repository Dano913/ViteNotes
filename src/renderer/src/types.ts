import { ReactNode } from "react";

export interface PurchaseHistory {
  price: number;
  quantity: number;
  date: string |number;
}

export interface CloseHistory {
  price: number;
  quantity: number;
  date: string |number;
}



export interface Assets {
  [x: string]: any;
  symbolname: ReactNode;
  icon: any;
  circulatingSupply: number;
  marketCap: any;
  investment: any;
  valueInEUR: number;
  valueinEUR: any;
  symbol: string; // Símbolo del activo (e.g., ETHUSDT)
  name?: string; // Nombre descriptivo opcional (e.g., "Ethereum")
  amount: number; // Cantidad de criptomonedas que posees
  purchaseHistory: PurchaseHistory[]; // Historial de compras
  currentPrice: number; // Precio actual del activo
  value: number; // Valor actual en euros u otra moneda
  averageOpenPrice?: number; // Precio promedio de compra
  priceChangePercent?: number; // Porcentaje de cambio de precio
  previousPrice?: number; // Precio anterior usado para calcular variaciones
  previousDayTotal?: number; // Total del día anterior, si aplica
  variation?: number; // Variación entre precios actuales y anteriores
  closeHistory: CloseHistory[];
  profit: number;
}



export interface WebSocketMessage {
  e: string;
  E: number;
  s: string;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
}
