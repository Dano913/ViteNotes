import React, { useState } from 'react';
import { CryptoAsset } from '../types/crypto';

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: CryptoAsset;
  onAddPosition: (symbol: string, quantity: number, price: number, date: string) => void;
}

const CryptoModal: React.FC<CryptoModalProps> = ({ isOpen, onClose, asset, onAddPosition }) => {
  const [sortKey, setSortKey] = useState<'quantity' | 'price' | 'value' | 'performance' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newDate, setNewDate] = useState<string>('');

  if (!isOpen) return null;

  // Ordenar el historial de compras
  const sortedHistory = [...asset.purchaseHistory].sort((a, b) => {
    const getValue = (entry: typeof a) => {
      switch (sortKey) {
        case 'quantity': return entry.quantity;
        case 'price': return entry.price;
        case 'value': return entry.quantity * asset.currentPrice;
        case 'performance': return (entry.quantity * asset.currentPrice) - (entry.quantity * entry.price);
        case 'date': return new Date(entry.date).getTime();
        default: return 0;
      }
    };

    return sortOrder === 'asc' ? getValue(a) - getValue(b) : getValue(b) - getValue(a);
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleAddPosition = () => {
    if (newQuantity > 0 && newPrice > 0 && newDate) {
      onAddPosition(asset.symbol, newQuantity, newPrice, new Date(newDate).toISOString());
      setNewQuantity(0);
      setNewPrice(0);
      setNewDate('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[var(--bg-color)] text-[var(--text-color)] font-bold p-6 rounded-xl shadow-lg w-[95vw] max-w-[900px]">
        <h2 className="text-2xl font-bold mb-4">{asset.name} - {asset.symbol}</h2>
        
        {/* Tabla de valores generales */}
        <table className="w-full border border-white  rounded-xl overflow-hidden mb-4">
          <thead>
            <tr className=" text-[var(--text-color)] bg-[var(--secondary-bg-color)]">
              <th className="p-2 ">Unidades</th>
              <th className="p-2 ">Precio Actual</th>
              <th className="p-2 ">Valor Total</th>
              <th className="p-2 ">Invertido Total</th>
              <th className="p-2 ">Rendimiento Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center bg-[var(--terciary-bg-color)] ">
              <td className="p-2 ">{asset.amount}</td>
              <td className="p-2 ">{asset.currentPrice}</td>
              <td className="p-2 ">{asset.value.toFixed(2)}</td>
              <td className="p-2 ">{asset.investment.toFixed(2)}</td>
              <td className={`p-2 ${asset.value - asset.investment >= 0 ? 'text-green-600' : 'text-red-600'}`}> 
                {(asset.value - asset.investment).toFixed(2)} ({((asset.value / asset.investment - 1) * 100).toFixed(2)}%)
              </td>
            </tr>
          </tbody>
        </table>

        <div className="overflow-x-auto py-4">
          <table className="w-full border border-[var(--border-color)] rounded-xl overflow-hidden mt-2">
            <thead>
              <tr className="bg-[var(--secondary-bg-color)] text-[var(--text-color)]">
                <th className="p-2 cursor-pointer" onClick={() => handleSort('date')}>Fecha {sortKey === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('quantity')}>Cantidad {sortKey === 'quantity' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('price')}>Precio Compra {sortKey === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('value')}>Valor Actual {sortKey === 'value' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('performance')}>Rendimiento {sortKey === 'performance' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((history, index) => {
                const positionValue = history.quantity * asset.currentPrice;
                const performance = positionValue - (history.quantity * history.price);
                const performancePercentage = ((positionValue / (history.quantity * history.price) - 1) * 100).toFixed(2);

                return (
                  <tr key={index} className="text-center bg-[var(--terciary-bg-color)]">
                    <td className="p-2 ">{new Date(history.date).toLocaleDateString()}</td>
                    <td className="p-2 ">{history.quantity}</td>
                    <td className="p-2 ">{history.price.toFixed(2)}</td>
                    <td className="p-2 ">{positionValue.toFixed(2)}</td>
                    <td className={`p-2 ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{performance.toFixed(2)} ({performancePercentage}%)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;
