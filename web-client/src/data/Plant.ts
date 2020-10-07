/* eslint-disable no-redeclare */
import { differenceInDays, formatDistanceStrict, startOfDay } from "date-fns";
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

export function waterNextAt(plant: Plant): Date {
  return nextActionDueDate({
    lastPerformedAt: plant.lastWateredAt,
    periodInDays: plant.wateringPeriodInDays,
    plantCreatedAt: plant.createdAt,
  });
}

export function fertilizeNextAt(plant: Plant): Date | undefined {
  return nextActionDueDate({
    lastPerformedAt: plant.lastFertilizedAt,
    periodInDays: plant.fertilizingPeriodInDays,
    plantCreatedAt: plant.createdAt,
  });
}

export function needsWater(plant: Plant, now = Date.now()): boolean {
  return waterNextAt(plant).valueOf() <= now;
}

export function formatNextWaterDate(plant: Plant): string {
  const lastWateredAtDate = plant.lastWateredAt;
  if (!lastWateredAtDate) return "Today";
  const nextWaterDate = add(lastWateredAtDate, {
    days: plant.wateringPeriodInDays,
  });
  return dateFormatters.date.format(nextWaterDate);
}

export function formatTimeUntilAction(
  nextActionDate: Date,
  now = new Date(Date.now()),
): string {
  const timeUntil = differenceInDays(nextActionDate, now);
  if (timeUntil < 0) {
    return "today";
  }
  // TODO: tests
  if (timeUntil <= 1) return "tomorrow";

  return `in ${formatDistanceStrict(now, nextActionDate, {
    roundingMethod: "ceil",
  })}`;
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

export function nextActionDueDate(args: {
  periodInDays: number;
  lastPerformedAt: Date | null;
  plantCreatedAt: Date;
}): Date;
export function nextActionDueDate(args: {
  periodInDays: null;
  lastPerformedAt: Date | null;
  plantCreatedAt: Date;
}): undefined;
export function nextActionDueDate(args: {
  periodInDays: number | null;
  lastPerformedAt: Date | null;
  plantCreatedAt: Date;
}): Date | undefined;
export function nextActionDueDate({
  periodInDays,
  plantCreatedAt,
  lastPerformedAt,
}: {
  periodInDays: number | null;
  lastPerformedAt: Date | null;
  plantCreatedAt: Date;
}): Date | undefined {
  if (periodInDays === null) return undefined;

  const endOfPeriod = add(lastPerformedAt || plantCreatedAt, {
    days: periodInDays,
  });

  return startOfDay(endOfPeriod);
}
