import { useState, useCallback } from 'react';
import type { CryptoAsset } from '../types/crypto';

export function usePortfolio(initialPortfolio: CryptoAsset[]) {
  const [assets, setAssets] = useState<CryptoAsset[]>(
    initialPortfolio.map(asset => ({
      ...asset,
      currentPrice: 0,
      value: 0,
    }))
  );

  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});

  const updatePrice = useCallback((symbol: string, price: number) => {
    let adjusted = price;

    if (symbol === "PEPEUSDC") {
      adjusted = price * 1_000_000;
    }

    setAssets(prevAssets => {
      const asset = prevAssets.find(a => a.symbol === symbol);
      if (!asset) return prevAssets;

      setPreviousPrices(prev => ({ ...prev, [symbol]: asset.currentPrice }));

      return prevAssets.map(a =>
        a.symbol === symbol
          ? { ...a, currentPrice: adjusted, value: a.amount * adjusted }
          : a
      );
    });
  }, []);

  const addCrypto = useCallback((newCrypto: CryptoAsset) => {
    setAssets(prevAssets => [
      ...prevAssets,
      {
        ...newCrypto,
        currentPrice: 0,
        value: 0,
      }
    ]);
  }, []);

  const deleteCrypto = useCallback((symbol: string) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.symbol !== symbol));
  }, []);

  return { assets, previousPrices, updatePrice, addCrypto, deleteCrypto };
}
