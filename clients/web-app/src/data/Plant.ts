import add from 'date-fns/add';

export type Plant = {
  id: string;
  name: string;
  wateringPeriodInDays: number;
  wateringTimes: Date[];
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
