import { useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioCard } from '../components/PortfolioCard';
import { TotalBalance } from '../components/TotalBalance';
import { CryptoSelector } from '../components/CryptoSelector';
import CryptoModal from '../components/CryptoModal';
import { OrderbookTable } from '../components/OrderbookTable';
import { aggregateLevels } from '../utils/orderbook';
import { TimeframeSelector } from '../components/TimeframeSelector';
import { CandlestickChart } from '../components/CandlestickChart';
import { Dropdown } from '../components/Dropdown';
import { initialPortfolio } from '../components/initialPortfolio';

const timeframeMap = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

const EXCHANGE_RATE = 0.987;

const fetchDailyClosePrices = async (symbols) => {
  const prices = {};

  for (const symbol of symbols) {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=1`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const closePrice = parseFloat(data[0][1]); // Precio de cierre en la posición 4
        prices[symbol] = closePrice;
      }
    } catch (error) {
      console.error(`Error fetching daily close for ${symbol}:`, error);
    }
  }

  return prices;
};

function Crypto({ isSidebarExpanded }) {
  const [assets, setAssets] = useState([]);
  const [dailyClosePrices, setDailyClosePrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null); 
  const wsRef = useRef(null);
  const [orderbook, setOrderbook] = useState(null);
  const [aggregationLevel, setAggregationLevel] = useState('0.01');
  const [pair, setPair] = useState('BTCUSDT');
  const [quantityPrecision, setQuantityPrecision] = useState('2');
  const [pricePrecision, setPricePrecision] = useState('2');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [chartData, setChartData] = useState([]);
  const [,setError] = useState(null);
  const [marketCaps, setMarketCaps] = useState({});

  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${pair}&limit=3000`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch orderbook data');
        }
        const data = await response.json();

        const bids = aggregateLevels(
          data.bids.map(([price, quantity]) => ({ price, quantity })),
          parseFloat(aggregationLevel),
          'bid'
        ).slice(0, 10);

        const asks = aggregateLevels(
          data.asks.map(([price, quantity]) => ({ price, quantity })),
          parseFloat(aggregationLevel),
          'ask'
        ).slice(-10);

        const midPrice = (
          (parseFloat(bids[0].price) + parseFloat(asks[0].price)) /
          2
        ).toFixed(parseInt(pricePrecision) + 2);

        setOrderbook({ bids, asks, midPrice });
        setError(null);
      } catch (error) {
        console.error('Error fetching orderbook:', error);
        setError('Failed to fetch orderbook data. Please try again later.');
      }
    };

    const fetchChartData = async () => {
      try {
        const binanceTimeframe = timeframeMap[selectedTimeframe];
        if (!binanceTimeframe) {
          throw new Error('Invalid timeframe');
        }

        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${binanceTimeframe}&limit=3000`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const data = await response.json();

        const processedData = data.map((candle) => ({
          time: (candle[0] / 1000) + 7200,
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
        }));
        setChartData(processedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Failed to fetch chart data. Please try again later.');
      }
    };

    fetchOrderbook();
    fetchChartData();

    const interval = setInterval(() => {
      fetchOrderbook();
      fetchChartData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [pair, aggregationLevel, pricePrecision, selectedTimeframe]);

  const symbol = pair.replace('USDT', '');

  const updatePrice = useCallback((symbol, price) => {
    let adjusted = price;

    if (symbol === "PEPEUSDT") {
      adjusted = price * 1000000;
    }
    
    setAssets(prevAssets => {
      const asset = prevAssets.find(a => a.symbol === symbol);
      if (!asset) return prevAssets;

      setPreviousPrices(prev => ({ ...prev, [symbol]: asset.currentPrice }));

      return prevAssets.map(a => {
        if (a.symbol === symbol) {
          // Convertir el valor a euros
          const valueInEuros = a.amount * adjusted * EXCHANGE_RATE;
          return {
            ...a,
            currentPrice: adjusted,
            value: valueInEuros,
          };
        }
        return a;
      });
    });
  }, []);

  const connectWebSocket = useCallback((symbols) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbols.map(s => s.toLowerCase()).join('@trade/')}@trade`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      updatePrice(data.s, price);
    };

    wsRef.current = ws;
  }, [updatePrice]);

  const handleOpenModal = (asset) => {
    setSelectedAsset(asset);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  // Initialize assets only once
  useEffect(() => {
    setAssets(initialPortfolio.map(asset => ({
      ...asset,
      currentPrice: 0,
      value: 0
    })));

    const symbols = initialPortfolio.map((asset) => asset.symbol);
    fetchDailyClosePrices(symbols).then((prices) => setDailyClosePrices(prices));
  }, []);

  // Connect WebSocket when assets change
  useEffect(() => {
    const symbols = assets.map(asset => asset.symbol);
    if (symbols.length > 0) {
      connectWebSocket(symbols);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [assets.length, connectWebSocket]); // Only reconnect when number of assets changes

  const handleDeleteCrypto = useCallback((symbol) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.symbol !== symbol));
  }, []);

  useEffect(() => {
    const fetchMarketCaps = async () => {
      try {
        const symbols = assets.map(asset => asset.symbol).join(',');
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/market-cap?symbols=${symbols}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch market caps');
        }

        const data = await response.json();
        const marketCapsData = {};
        
        Object.entries(data.data).forEach(([symbol, info]) => {
          marketCapsData[symbol] = info.quote.USD.market_cap;
        });

        setMarketCaps(marketCapsData);
      } catch (error) {
        console.error('Error fetching market caps:', error);
      }
    };

    if (assets.length > 0) {
      fetchMarketCaps();
      const interval = setInterval(fetchMarketCaps, 5 * 60 * 1000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [assets]);

  if (!orderbook || !chartData) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
        <div className="text-[var(--text-color)] text-xl">Loading orderbook...</div>
      </div>
    );
  }
  
  const maxQuantity = Math.max(
    ...orderbook.asks.map((level) => parseFloat(level.quantity)),
    ...orderbook.bids.map((level) => parseFloat(level.quantity))
  );
  
  return (
    <div className="w-full flex items-start justify-center">
      <div className=" rounded-md h-[93vh] sm:h-[90vh] md:h-[93vh] lg:h-[93vh] xl:h-[94vh] mt-10 w-full grid flex flex-col">
        <div className="rounded-md grid grid-rows-[500px_auto_auto] items-center mt-2">
          <div className=" grid grid-cols-6 h-[500px]">
            <div className="col-span-1 h-full px-4">
              <OrderbookTable
                data={orderbook.asks}
                side="ask"
                maxQuantity={maxQuantity}
                pricePrecision={parseInt(pricePrecision)}
                quantityPrecision={parseInt(quantityPrecision)} 
                currentPrice={0}
              />
            </div>
            <div className="col-span-4 relative">
              {chartData.length > 0 && (
                <div>
                  <CandlestickChart data={chartData} />
                  <div className="absolute bottom-5 w-full">
                    <CryptoSelector
                      selectedSymbol={symbol}
                      onSelect={(newSymbol) => setPair(`${newSymbol}USDT`)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-1 px-4">
              <OrderbookTable
                data={orderbook.bids}
                side="bid"
                maxQuantity={maxQuantity}
                pricePrecision={parseInt(pricePrecision)}
                quantityPrecision={parseInt(quantityPrecision)} 
                currentPrice={0}
              />
            </div>
          </div>
          <div className="p-4 w-full h-[30px] justify-between flex items-center pb-6">
            <div className="justify-start flex w-[15%]">
              <TimeframeSelector
                selected={selectedTimeframe}
                onChange={setSelectedTimeframe}
              />
            </div>
            <div className="col-span-1 rounded-md w-[30%] justify-center h-10 items-center flex">
              <TotalBalance assets={assets} exchangeRate={EXCHANGE_RATE} />
            </div>
            <div className="flex w-[15%] justify-end">
              <Dropdown
                title="Level"
                options={['0.01', '0.1', '1', '10', '100']}
                value={aggregationLevel}
                onChange={(value) =>
                  setAggregationLevel(value)
                }
                titleClassName="text-lg"
              />  
              <Dropdown
                title="Quantity"
                options={['0', '1', '2', '3', '4']}
                value={quantityPrecision}
                onChange={(value) =>
                  setQuantityPrecision(value)
                }
                titleClassName="text-lg"
              />

              <Dropdown
                title="Price"
                options={['0', '1', '2', '3', '4']}
                value={pricePrecision}
                onChange={(value) => 
                  setPricePrecision(value)
                }
                titleClassName="text-lg flex"
              />
            </div>
          </div>
        </div>
      <div className=" text-[var(--text-color)] flex-1">
        <div className="text-xl flex justify-between gap-4 px-4  rounded-t-md pb-3">
          <div className="w-[8%] px-2 text-right flex items-center justify-start">Activos</div>
          <div className="w-[8%] px-2 text-right flex items-center justify-start">Ecosistema</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Precio</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">P/L</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Cambio</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">G/P</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end flex-nowrap overflow-hidden">G/P (%)</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Valor</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Invertido</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Unidades</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Apertura</div>
          <div className="w-[7%] px-2 text-right flex items-center justify-end">Mercado</div>
        </div>
        <div className="overflow-auto flex flex-col space-y-1">
          {assets.map(asset => (
            <PortfolioCard
              key={asset.symbol}
              asset={asset}
              previousPrice={previousPrices[asset.symbol]}
              dailyClose={dailyClosePrices[asset.symbol]}
              marketCap={marketCaps[asset.symbol]}
              onDelete={handleDeleteCrypto}
              isSidebarExpanded={isSidebarExpanded}
              onClick={() => handleOpenModal(asset)} 
            />
          ))}
        </div>
      </div>
      {/*<AddCryptoModal onAdd={handleAddCrypto} />*/}
      {/* Modal de Criptomoneda */}
      <CryptoModal
        isOpen={selectedAsset !== null} // Verificar si hay un activo seleccionado
        onClose={handleCloseModal} // Función para cerrar el modal
        asset={selectedAsset || initialPortfolio[0]} // Pasar el activo seleccionado o uno por defecto
        onAddPosition={function (_symbol, _quantity, _price, _date) {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
    </div>
  );
}

export default Crypto;