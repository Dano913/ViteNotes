import { SetStateAction, useState } from 'react';
import  { CryptoAsset } from '../types/crypto';

export const initialPortfolio: CryptoAsset[] = [
  {
    symbol: 'ETHUSDT',
    icon: 'ETHUSDT',
    name: 'Ethereum',
    symbolname: 'ETH',
    amount: 0.3283,
    investment: 1078.64,
    profit: 0,
    purchaseHistory: [
      { price: 3586.8042, quantity: 0.058894, date: 3-12-2024 },
      { price: 3140.7970, quantity: 0.031839, date: 19-11-2024 },
      { price: 3807.4870, quantity: 0.012428, date: 3-6-2024 },
      { price: 3109.4870, quantity: 0.034147, date: 6-5-2024 },
      { price: 3433.2930, quantity: 0.059706, date: 24-12-2024 },
      { price: 3433.6970, quantity: 0.059842, date: 28-12-2024 },
      { price: 2846.6547, quantity: 0.071472, date: 4-2-2025 }
    ],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory:[]
  },
  //{
  //  symbol: 'SOLUSDT',
  //  name: 'Solana',
  //  icon: 'SOLUSDT',
  //  symbolname: 'SOL',
  //  amount: 2.23405,
  //  investment: 434.60,
  //  profit: 452.52,
  //  purchaseHistory: [
  //    { price: 162.5483, quantity: 0.654327, date: 1-8-2024  },
  //    { price: 148.5811, quantity: 0.269281, date: 1-7-2024 },
  //    { price: 206.2225, quantity: 0.687364, date: 18-3-2024 },
  //    { price: 235.3581, quantity: 0.611153, date: 12-12-2024 }, 
  //    { price: 210.4023, quantity: 0.007048, date: 4-2-2025 },
  //    { price: 238.4146, quantity: 0.004877, date: 4-12-2024 },
  //  ],
  //  circulatingSupply: 0,
  //  marketCap: 0,
  //  valueInEUR: 0,
  //  valueinEUR: 0,
  //  currentPrice: 0,
  //  value: 0,
  //  closeHistory:[
  //    { price: 183.1739, quantity: 0.654327, date: 17-2-2025  },
  //    { price: 183.1739, quantity: 0.269281, date: 17-2-2025 },
  //    { price: 183.1739, quantity: 0.687364, date: 17-2-2025 },
  //    { price: 254.0072, quantity: 0.611153, date: 18-1-2025 }, 
  //    { price: 183.1739, quantity: 0.007048, date: 17-2-2025 },
  //    { price: 183.1739, quantity: 0.004877, date: 17-2-2025 },
  //  ]
  //},
  {
    symbol: 'HBARUSDT',
    name: 'Hedera Hashgraph',
    icon: 'HBARUSDT',
    symbolname: 'HBAR',
    amount: 3240.98321,
    investment: 592.62,
    profit: 0,
    purchaseHistory: [{ price: 0.12887, quantity: 797.237526, date: 14-3-2024 },
    { price: 0.07128, quantity: 398.989899, date: 31-1-2024 },
    { price: 0.09040, quantity: 603.207965, date: 27-12-2023 },
    { price: 0.29292, quantity: 695.889662, date: 18-1-2025 },
    { price: 0.27235, quantity: 745.658160, date: 18-1-2025 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'RENDERUSDT',
    name: 'Render Token',
    icon: 'RENDERUSDT',
    symbolname: 'RENDER',
    amount: 85.157,
    investment: 573.22,
    profit: 0,
    purchaseHistory: [
      { price: 8.196, quantity: 6.100536, date: 19-11-2024 },
      { price: 7.749, quantity: 8.527552, date: 1-7-2024 },
      { price: 10.179, quantity: 4.912074, date: 2-4-2024 },
      { price: 9.438, quantity: 21.949152, date: 13-12-2024 },
      { price: 4.580, quantity: 43.668122, date: 17-2-2024 }
    ],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'LINKUSDT',
    name: 'Chainlink',
    icon: 'LINKUSDT',
    symbolname: 'LINK',
    amount: 3.3574,
    investment: 60.00,
    profit: 0,
    purchaseHistory: [{ price: 17.8710, quantity: 3.357395, date: 3-6-2024 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'POLUSDT',
    name: 'Polygon',
    icon: 'POLUSDT',
    symbolname: 'POL',
    amount: 68.86120,
    investment: 57.59,
    profit: 0,
    purchaseHistory: [{ price: 0.83632, quantity: 68.861201, date: 18-11-2023 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'PEPEUSDT',
    name: 'Pepe in millions',
    icon: 'PEPEUSDT',
    symbolname: 'PEPExM',
    amount: 2.856793,
    investment: 58.42,
    profit: 0,
    purchaseHistory: [{ price: 20.453, quantity: 2.856793, date: 19-11-2024 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'FETUSDT',
    name: 'Fetch AI',
    icon: 'FETUSDT',
    symbolname: 'FET',
    amount: 215.12776,
    investment: 259.55,
    profit: 0,
    purchaseHistory: [
      { price: 1.42954, quantity: 74.375135, date: 8-11-2024 },
      { price: 2.92758, quantity: 19.101101, date: 2-4-2024 },
      { price: 0.79995, quantity: 121.65152, date: 17-2-2025 }
    ],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'UNIUSDT',
    name: 'Uniswap',
    icon: 'UNIUSDT',
    symbolname: 'UNI',
    amount: 11.5494,
    investment: 155.23,
    profit: 0,
    purchaseHistory: [{ price: 13.5494, quantity: 11.457333, date: 17-2-2024 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  {
    symbol: 'BERAUSDT',
    name: 'BeraChain',
    icon: 'BERAUSDT',
    symbolname: 'BERA',
    amount: 7.882789,
    investment: 53.11,
    profit: 0,
    purchaseHistory: [{ price: 6.739, quantity: 7.882789, date: 5-3-2024 }],
    circulatingSupply: 0,
    marketCap: 0,
    valueInEUR: 0,
    valueinEUR: 0,
    currentPrice: 0,
    value: 0,
    closeHistory: []
  },
  // ... rest of the initial portfolio data
];

// Hook para manejar los activos
export const useCryptoAssets = () => {
  const [assets, setAssets] = useState(initialPortfolio);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const selectAsset = (asset: SetStateAction<null>) => {
    setSelectedAsset(asset);
  };

  const updateAsset = (updatedAsset: { symbol: any; }) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.symbol === updatedAsset.symbol ? updatedAsset : asset
      )
    );
  };

  return {
    assets,
    setAssets,
    selectedAsset,
    setSelectedAsset: selectAsset,
    updateAsset
  };
};
export type { CryptoAsset };

