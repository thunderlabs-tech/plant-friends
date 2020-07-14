import add from "date-fns/add";
import { PlantEvent } from "./PlantEvent";

export type Plant = {
  _id: string;
  name: string;
  wateringPeriodInDays: number;
  wateringTimes: Date[];
  lastWateredAt?: Date | null;
  timeOfDeath: Date | null;
  userId: string;
  events: PlantEvent[];
};

export type PlantInput = {
  name: string;
  wateringTimes: Date[];
  timeOfDeath: Date | null;
  wateringPeriodInDays: number;
  userId: string;
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

export function formatNextWaterDate(plant: Plant) {
  const lastWateredAtDate = plant.lastWateredAt;
  if (!lastWateredAtDate) return "Needs to be watered";
  const nextWaterDate = add(lastWateredAtDate, {
    days: plant.wateringPeriodInDays,
  });
  return `Water next on ${nextWaterDate.toLocaleDateString()}`;
}

export function formatTimeOfDeath(plant: Plant) {
  if (!plant.timeOfDeath) return `Still going strong`;
  // TO DO: add `createdAt` and format epitaph as "June 2020 - July 2020"
  return `Died ${plant.timeOfDeath.toLocaleDateString()}`;
}
