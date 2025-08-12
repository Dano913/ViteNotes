import { useEffect, useState } from 'react';
import type { CryptoAsset } from '../types/crypto';
import { Card } from '../components/ui/card';
import React from 'react';

interface TotalBalanceProps {
  assets: CryptoAsset[];
  exchangeRate: number; // Tasa de cambio de USD a EUR
}

export function TotalBalance({ assets }: TotalBalanceProps) {
   // Cantidad invertida
  const [usdtToEurRate, setUsdtToEurRate] = useState(0);
  const [, setError] = useState(false);
  const [, setCurrentTime] = useState<string>(''); // Estado para la hora actual

  useEffect(() => {
    // Obtener el tipo de cambio USDT a EUR
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT")
      .then((response) => response.json())
      .then((data) => {
        if (data.price) {
          setUsdtToEurRate(1 / parseFloat(data.price));
        }
      })
      .catch(() => {
        console.error("Error fetching USDT to EUR rate");
        setError(true);
      });

      

    // Actualizar la hora cada segundo
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Cambiar a `true` para formato 12 horas
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, []);
  const investedAmount = 2888.38 * usdtToEurRate;
  const totalBalance = assets.reduce((sum, asset) => sum + ((asset.value * usdtToEurRate) || 0), 0);

  const profitOrLoss = totalBalance - investedAmount;
  const profitOrLossPercentage = (profitOrLoss / investedAmount) * 100;

  return (
    <Card className="w-full">
      <div className="w-full flex flex-col items-center text-2xl font-bold">
        <div className="w-full flex justify-center gap-x-6">
          <p
            className={`w-[30%] justify-end flex ${profitOrLoss >= 0 ? 'text-[var(--secondary-text-color)]' : 'text-[var(--terciary-text-color)]'}`}
          >
            {profitOrLoss >= 0 ? '+' : ''}
            {profitOrLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </p>
          <p className="w-[40%] justify-center text-3xl font-bold flex items-center  text-[var(--text-color)]">
            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </p>
          <p
            className={`w-[30%] flex justify-start ${profitOrLossPercentage >= 0 ? 'text-[var(--secondary-text-color)]' : 'text-[var(--terciary-text-color)]'}`}
          >
            {profitOrLossPercentage >= 0 ? '+' : ''}
            {profitOrLossPercentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
          </p>
        </div>
      </div>
    </Card>
  );
}  