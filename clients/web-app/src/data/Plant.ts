import add from 'date-fns/add';

export type Plant = {
  id: string;
  name: string;
  wateringPeriodInDays: number;
  wateringTimes: Date[];
  sunTypeNeeded?: 'direct' | 'shady';
  sunAmountNeededInHours?: number;
  temperatureMinimumInCelsius?: number;
  temperatureMaximumInCelsius?: number;
  timeOfDeath?: Date;
};

export function lastWateredAt(plant: Plant): Date | undefined {
  const sortedTimes = plant.wateringTimes.sort((a, b) =>
    a.valueOf() < b.valueOf() ? 1 : a.valueOf() === b.valueOf() ? 0 : -1
  );
  return sortedTimes[0];
}

export function waterNextAt(plant: Plant): Date | undefined {
  const lastWateredAtDateTime: Date | undefined = lastWateredAt(plant);
  if (!lastWateredAtDateTime) return undefined;

  const lastWateredAtBeginningOfDay = new Date(
    lastWateredAtDateTime.getFullYear(),
    lastWateredAtDateTime.getMonth(),
    lastWateredAtDateTime.getDate()
  );

  return add(lastWateredAtBeginningOfDay.valueOf(), { days: plant.wateringPeriodInDays });
}

export function needsWater(plant: Plant, now = Date.now()): boolean {
  const waterNextAtDate = waterNextAt(plant);
  if (!waterNextAtDate) return true;
  return waterNextAtDate.valueOf() <= now;
}

export function formatNextWaterDate(plant: Plant) {
  const lastWateredAtDate = lastWateredAt(plant);
  if (!lastWateredAtDate) return 'Needs to be watered';
  const nextWaterDate = add(lastWateredAtDate, { days: plant.wateringPeriodInDays });
  return `Water next on ${nextWaterDate.toLocaleDateString()}`;
}

export function formatTimeOfDeath(plant: Plant) {
  if (!plant.timeOfDeath) return `Still going strong`;
  // TO DO: add `createdAt` and format epitaph as "June 2020 - July 2020"
  return `Died ${plant.timeOfDeath.toLocaleDateString()}`;
}
