import type { OrderLevel } from '../types/orderbook';

export function aggregateLevels(
  levels: OrderLevel[],
  aggregationLevel: number,
  side: 'bid' | 'ask'
): OrderLevel[] {
  const aggregated: { [key: string]: string } = {};

  levels.forEach((level) => {
    const price = parseFloat(level.price);
    const quantity = parseFloat(level.quantity);
    const aggregatedPrice =
      Math.floor(price / aggregationLevel) * aggregationLevel;
    const key = aggregatedPrice.toString();

    if (aggregated[key]) {
      aggregated[key] = (
        parseFloat(aggregated[key]) + quantity
      ).toString();
    } else {
      aggregated[key] = quantity.toString();
    }
  });

  return Object.entries(aggregated)
    .map(([price, quantity]) => ({
      price,
      quantity,
    }))
    .sort((a, b) =>
      side === 'bid'
        ? parseFloat(b.price) - parseFloat(a.price)
        : parseFloat(a.price) - parseFloat(b.price)
    );
}