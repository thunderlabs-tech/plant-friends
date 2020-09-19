import add from "date-fns/add";
import PlantEvent from "src/data/PlantEvent";
import { dateFormatters } from "../utilities/i18n";

export type Plant = {
  id: string;
  name: string;
  wateringPeriodInDays: number;
  lastWateredAt: Date | null;
  timeOfDeath: Date | null;
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

export function formatWateringTime(date: Date | null): string {
  if (date === null) return "Never";
  return dateFormatters.dateTime.format(date);
}
