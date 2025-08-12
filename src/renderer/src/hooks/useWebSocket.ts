import { useRef, useEffect, useCallback } from 'react';
import type { WebSocketMessage } from '../types';

export function useWebSocket(
  symbols: string[],
  updatePrice: (symbol: string, price: number) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbols.map(s => s.toLowerCase()).join('@trade/')}@trade`
    );

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      const price = parseFloat(data.p);
      updatePrice(data.s, price);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbols, updatePrice]);

  useEffect(() => {
    if (symbols.length > 0) {
      return connectWebSocket();
    }
  }, [symbols, connectWebSocket]);
}
