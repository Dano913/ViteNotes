import React from 'react';
import type { OrderLevel } from '../types/orderbook';

interface OrderbookTableProps {
  data: OrderLevel[];
  side: 'bid' | 'ask';
  maxQuantity: number;
  pricePrecision: number;
  quantityPrecision: number;
  currentPrice: number;
}

export function OrderbookTable({
  data,
  side,
  maxQuantity,
  pricePrecision,
  quantityPrecision,
}: OrderbookTableProps) {

  const bgColor = side === 'bid' ? 'bg-green-500/20' : 'bg-red-500/20';
  const textColor = side === 'bid' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="relative w-full h-full flex flex-col">
      <table className="w-full h-full flex flex-col flex-1 rounded-md">
        <thead>
          <tr className="text-sm grid grid-cols-3 px-2">
            <th className="text-left pb-1">Price</th>
            <th className="text-center pb-1">Quantity</th>
            <th className="text-right pb-1">Total</th>
          </tr>
        </thead>
        <tbody className=" flex flex-col flex-1 min-h-0 rounded-b-md py-2 gap-0.3">
          {data.map((level,index) => {
            const quantity = parseFloat(level.quantity);
            const price = parseFloat(level.price);
            const total = (quantity * price).toFixed(quantityPrecision);
            const percentWidth = (quantity / maxQuantity) * 100;

            return (
              <tr key={index} className="relative grid grid-cols-3 gap-4   hover:opacity-70 flex-grow items-center px-2">
                <div
              className={`absolute inset-0 ${bgColor}`}
              style={{
                width: `${percentWidth}%`,
                [side === 'bid' ? 'right' : 'left']: 0
              }}
            />
            <div className={` relative ${textColor}`}>
              {parseFloat(level.price).toFixed(pricePrecision)}
            </div>
            <div className="  relative text-center text-gray-300">
              {quantity.toFixed(quantityPrecision)}
            </div>
                <td className=" text-right py-1">{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
