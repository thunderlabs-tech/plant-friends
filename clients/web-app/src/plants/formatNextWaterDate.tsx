import { Plant, lastWateredAt } from '../data/Plant';

export function formatNextWaterDate(plant: Plant) {
  const lastWateredAtDate = lastWateredAt(plant);
  if (!lastWateredAtDate) return 'Water today';
  const nextWaterDate = new Date(lastWateredAtDate.valueOf() + plant.wateringPeriodInDays * 24 * 60 * 60 * 1000);
  return `Water next on ${nextWaterDate.toLocaleDateString()}`;
}
