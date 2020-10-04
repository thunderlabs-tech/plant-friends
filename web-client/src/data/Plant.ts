import add from "date-fns/add";
import PlantEvent from "src/data/PlantEvent";
import { dateFormatters } from "../utilities/i18n";

export type Plant = {
  id: string;
  name: string;
  timeOfDeath: Date | null;
  lastWateredAt: Date | null;
  lastFertilizedAt: Date | null;
  wateringPeriodInDays: number;
  fertilizingPeriodInDays: number | null;
  events: PlantEvent[];
  createdAt: Date;
};

export type PlantInput = {
  name: string;
  timeOfDeath: Date | null;
  wateringPeriodInDays: number;
};

export function waterNextAt(plant: Plant): Date | undefined {
  if (!plant.lastWateredAt) return undefined;

  const lastWateredAtBeginningOfDay = new Date(
    plant.lastWateredAt.getFullYear(),
    plant.lastWateredAt.getMonth(),
    plant.lastWateredAt.getDate(),
  );

  return add(lastWateredAtBeginningOfDay.valueOf(), {
    days: plant.wateringPeriodInDays,
  });
}

export function fertilizeNextAt(plant: Plant): Date | undefined {
  if (plant.lastFertilizedAt === null || plant.fertilizingPeriodInDays === null)
    return undefined;

  const lastFertilizedAtBeginningOfDay = new Date(
    plant.lastFertilizedAt.getFullYear(),
    plant.lastFertilizedAt.getMonth(),
    plant.lastFertilizedAt.getDate(),
  );
  return add(lastFertilizedAtBeginningOfDay.valueOf(), {
    days: plant.fertilizingPeriodInDays,
  });
}

export function needsWater(plant: Plant, now = Date.now()): boolean {
  const waterNextAtDate = waterNextAt(plant);
  if (!waterNextAtDate) return true;
  return waterNextAtDate.valueOf() <= now;
}

export function formatNextWaterDate(plant: Plant): string {
  const lastWateredAtDate = plant.lastWateredAt;
  if (!lastWateredAtDate) return "Today";
  const nextWaterDate = add(lastWateredAtDate, {
    days: plant.wateringPeriodInDays,
  });
  return dateFormatters.date.format(nextWaterDate);
}

export function formatTimeOfDeath(plant: Plant): string {
  if (!plant.timeOfDeath) return `Still going strong`;
  // TO DO: add `createdAt` and format epitaph as "June 2020 - July 2020"
  return `Died ${plant.timeOfDeath.toLocaleDateString()}`;
}

export function formatLastActionTime(date: Date | null): string {
  if (date === null) return "Never";
  return dateFormatters.dateTime.format(date);
}
