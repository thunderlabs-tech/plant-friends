import add from 'date-fns/add';
import { Plant, lastWateredAt } from '../data/Plant';

export function formatNextWaterDate(plant: Plant) {
  const lastWateredAtDate = lastWateredAt(plant);
  if (!lastWateredAtDate) return 'Water today';
  const nextWaterDate = add(lastWateredAtDate, { days: plant.wateringPeriodInDays });
  return `Water next on ${nextWaterDate.toLocaleDateString()}`;
}
