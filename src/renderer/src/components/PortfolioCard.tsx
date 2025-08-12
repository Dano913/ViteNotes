import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import cryptoIcons from "./cryptoIcons";
import { CryptoAsset } from "../types/crypto";
import React from "react";
import RenderPng from '../icons/render.png'
import BeraPng from '../icons/bera.png'

interface PortfolioCardProps {
  asset: CryptoAsset;
  previousPrice?: number;
  dailyClose: number | undefined;
  onDelete?: (symbol: string) => void;
  circulatingSupply?: number;
  isSidebarExpanded: boolean;
  onClick: () => void; 
}

export function PortfolioCard({ asset, previousPrice, dailyClose, onClick }: PortfolioCardProps) {
  const [usdtToEurRate, setUsdtToEurRate] = useState(0);
  const [, setError] = useState(false);
  const CryptoIcon = cryptoIcons[asset.icon];

  useEffect(() => {
    const fetchExchangeRate = () => {
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT")
        .then((response) => response.json())
        .then((data) => {
          if (data.price) {
            setUsdtToEurRate(1 / parseFloat(data.price));
          } else {
            throw new Error("Invalid price data");
          }
        })
        .catch((error) => {
          console.error("Error fetching USDT to EUR rate:", error);
          setError(true);
        });
    };
  
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60000); // Update every 60s
  
    return () => clearInterval(interval);
  }, []);
  
  const priceChange = previousPrice ? asset.currentPrice - previousPrice : 0;
  const isPositive = priceChange >= 0;
  const valueInEUR = asset.value * usdtToEurRate;
  const totalInvestment = asset.purchaseHistory.reduce(
    (total: number, purchase: { quantity: number; price: number; }) => total + purchase.quantity * purchase.price,
    0
  );
  const investeur = asset.investment * usdtToEurRate;
  const totalGainLoss = valueInEUR - investeur;
  const totalGainLossPercentage =
    totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const gainLoss = (() => {
    if (!usdtToEurRate || !dailyClose) return 0;
    if (asset.symbol === "PEPEUSDT") {
      const adjustedDailyClose = dailyClose ? dailyClose * 1_000_000 : 0;
      return adjustedDailyClose
        ? (asset.currentPrice - adjustedDailyClose) * asset.amount * usdtToEurRate
        : 0;
    } else {
      return dailyClose
        ? (asset.currentPrice - dailyClose) * asset.amount * usdtToEurRate
        : 0;
    }
  })();

  const gainLossPercentage = (() => {
    if (asset.symbol === "PEPEUSDT") {
      const adjustedDailyClose = dailyClose ? dailyClose * 1_000_000 : 0;
      return adjustedDailyClose
        ? ((asset.currentPrice - adjustedDailyClose) / adjustedDailyClose) * 100
        : 0;
    } else {
      return dailyClose
        ? ((asset.currentPrice - dailyClose) / dailyClose) * 100
        : 0;
    }
  })();

  const marketCap = asset.circulatingSupply
    ? asset.currentPrice * asset.circulatingSupply
    : undefined;

  return (
    <Card className="" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="hover:opacity-70 text-md flex justify-between px-4 items-center gap-4">
        <div className="flex items-center h-[40px] w-[8%] text-[var(--text-color)] space-x-2 px-2">
          <div className="items-center">
            {asset.symbol === 'RENDERUSDT' ? (
              <img src={RenderPng} alt={`${asset.symbol} icon`} style={{ width: '30px', height: '30px', borderRadius: '4px' }} />
            ) : asset.symbol === 'BERAUSDT' ? (
              <img src={BeraPng} alt={`${asset.symbol} icon`} style={{ width: '30px', height: '30px', borderRadius: '4px' }} />
            ) : CryptoIcon ? (
              <CryptoIcon className="" />
            ) : (
              <span>-</span>
            )}
          </div>
          <div className="flex items-center">
            {asset.symbolname}
          </div>
        </div>
        <div className="flex items-center w-[8%] px-2">
          {asset.name}
        </div>
        <div className={`px-2 w-[7%] flex justify-end ${isPositive ? "text-[var(--secondary-text-color)]" : "text-[var(--terciary-text-color)]"}`}>
          ${asset.currentPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </div>
        <div className={`px-2 w-[7%] flex justify-end hidden xl:flex ${gainLoss >= 0 ? 'text-[var(--secondary-text-color)]' : 'text-[var(--terciary-text-color)]'}`}>
          {gainLoss.toFixed(2)}€
        </div>
        <div className={`px-2 w-[7%] flex justify-end hidden xl:flex ${gainLossPercentage >= 0 ? 'text-[var(--secondary-text-color)]' : 'text-[var(--terciary-text-color)]'}`}>
          {gainLossPercentage.toFixed(2)}%
        </div>
        <div className={`px-2 w-[7%] flex justify-end hidden xl:flex ${totalGainLoss >= 0 ? "text-[var(--secondary-text-color)]" : "text-[var(--terciary-text-color)]"}`}>
          {totalGainLoss.toFixed(2)}€
        </div>
        <div className={`px-2 w-[7%] flex justify-end hidden xl:flex ${totalGainLossPercentage >= 0 ? "text-[var(--secondary-text-color)]" : "text-[var(--terciary-text-color)]"}`}>
          {totalGainLossPercentage.toFixed(2)}%
        </div>
        <div className={`px-2 w-[7%] flex justify-end xl:flex ${isPositive ? "text-[var(--secondary-text-color)]" : "text-[var(--terciary-text-color)]"}`}>
          {valueInEUR.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}€
        </div>
        <div className="px-2 w-[7%] flex justify-end hidden xl:flex text-[var(--text-color)]">
          {investeur.toLocaleString()}
        </div>
        <div className="px-2 w-[7%] flex justify-end hidden xl:flex text-[var(--text-color)]">
          {asset.amount.toLocaleString()}
        </div>
        {asset.purchaseHistory.length > 0 && (
          <div className="px-2 w-[7%] flex justify-end hidden xl:flex text-[var(--text-color)]">
            <span className="">
              ${(
                asset.purchaseHistory.reduce((total: number, purchase: { quantity: number; price: number; }) => total + purchase.quantity * purchase.price, 0) /
                asset.purchaseHistory.reduce((total: any, purchase: { quantity: any; }) => total + purchase.quantity, 0)
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
        <div className="px-2 w-[7%] flex justify-end text-[var(--text-color)]">
          {marketCap !== undefined
            ? `$${marketCap.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "N/A"}
        </div>
      </div>
    </Card>
  );
}