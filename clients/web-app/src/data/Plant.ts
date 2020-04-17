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
