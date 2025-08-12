import { useState, useEffect } from "react";

export const useExchangeRate = (): number | null => {
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=EURUSDC");
                const data = await response.json();
                setExchangeRate(parseFloat(data.price));
            } catch (error) {
                console.error("Error obteniendo la tasa de cambio:", error);
            }
        };

        fetchExchangeRate();
        const interval = setInterval(fetchExchangeRate, 10000); // Actualiza cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    return exchangeRate;
};
