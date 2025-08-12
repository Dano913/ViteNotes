// utils/calculateGainLoss.ts

export function calculateGainLoss(asset: { symbol: string; currentPrice: number; amount: number; }, dailyClose: number, exchangeRate: number) {
    if (!exchangeRate || !dailyClose) return 0;
  
    if (asset.symbol === "PEPEUSDT") {
      const adjustedDailyClose = dailyClose ? dailyClose * 1_000_000 : 0; // Ajusta la vela inicial
      return adjustedDailyClose
        ? (asset.currentPrice - adjustedDailyClose) * asset.amount * exchangeRate
        : 0;
    } else {
      return dailyClose
        ? (asset.currentPrice - dailyClose) * asset.amount * exchangeRate
        : 0;
    }
  }
  
  export function calculateGainLossPercentage(asset: { symbol: string; currentPrice: number; }, dailyClose: number) {
    if (asset.symbol === "PEPEUSDT") {
      const adjustedDailyClose = dailyClose ? dailyClose * 1_000_000 : 0; // Ajusta dailyClose para PEPE
      return adjustedDailyClose
        ? ((asset.currentPrice - adjustedDailyClose) / adjustedDailyClose) * 100
        : 0;
    } else {
      return dailyClose
        ? ((asset.currentPrice - dailyClose) / dailyClose) * 100
        : 0;
    }
  }
  