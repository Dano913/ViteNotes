import React from 'react';
import { cryptoIcons } from '../assets/cryptoIcons';

interface CryptoSelectorProps {
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

const symbols = [
  { symbol: 'BTC', icon: cryptoIcons.BTC },
  { symbol: 'ETH', icon: cryptoIcons.ETH },
  { symbol: 'RNDR', icon: cryptoIcons.RNDR },
  { symbol: 'FET', icon: cryptoIcons.FET, round: true },
  { symbol: 'LINK', icon: cryptoIcons.LINK },
  { symbol: 'PEPE', icon: cryptoIcons.PEPE, round: true },
  { symbol: 'SOL', icon: cryptoIcons.SOL },
  { symbol: 'UNI', icon: cryptoIcons.UNI },
  { symbol: 'HBAR', icon: cryptoIcons.HBAR },
  { symbol: 'POL', icon: cryptoIcons.POL },
  { symbol: 'BERA', icon: cryptoIcons.BERA },
];

export function CryptoSelector({ selectedSymbol, onSelect }: CryptoSelectorProps) {
  return (
    <div className="flex gap-4 justify-between px-6 rounded-xl">
      {symbols.map(({ symbol, icon, round }) => (
        <button
          key={symbol}
          onClick={() => onSelect(symbol)}
          className={`rounded-lg transition-colors ${
            selectedSymbol === symbol
          }`}
        >
          <img src={icon} alt={symbol} className={`w-5 h-5 ${round ? 'rounded-full' : ''}`} />
        </button>
      ))}
    </div>
  );
}
