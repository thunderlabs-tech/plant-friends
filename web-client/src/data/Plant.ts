/* eslint-disable no-redeclare */
import { formatDistanceStrict, startOfDay, startOfToday } from "date-fns";
import add from "date-fns/add";
import PlantEvent from "src/data/PlantEvent";
import { dateFormatters } from "../utilities/i18n";
import { isPast } from "../utilities/isPast";

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
  waterNextAt: Date;
  fertilizeNextAt: Date | null;
};

export function needsWater(plant: Plant, now = Date.now()): boolean {
  return isPast(plant.waterNextAt, now);
}

export function needsFertilizer(plant: Plant, now = Date.now()): boolean {
  if (!plant.fertilizeNextAt) return false;
  return isPast(plant.fertilizeNextAt, now);
}

export function actionRequired(plant: Plant): boolean {
  return needsWater(plant) || needsFertilizer(plant);
}

function minDate(date1: Date | undefined | null, date2: Date | undefined | null): Date | undefined {
  if (!date1) {
    if (!date2) return undefined;
    return date2;
  } else if (!date2) {
    return date1;
  }
  return date1 < date2 ? date1 : date2;
}

export function getNextReminderDate({ waterNextAt, fertilizeNextAt }: Plant): Date | undefined {
  const nextReminderDate = minDate(waterNextAt, fertilizeNextAt);
  if (!nextReminderDate) return undefined;

  return isPast(nextReminderDate) ? startOfToday() : nextReminderDate;
}

export function formatTimeUntilAction(
  nextActionDate: Date,
  now = new Date(Date.now()),
): string {
  const tomorrow = add(startOfDay(now), { days: 1 });

  if (nextActionDate < tomorrow) return "today";

  const dayAfterTomorrow = add(tomorrow, { days: 1 });
  if (nextActionDate < dayAfterTomorrow) return "tomorrow";

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
