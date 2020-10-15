import { pick } from "lodash";
import dateToString from "src/utilities/graphql/dateToString";
import { Plant } from "src/data/Plant";
import { formatAwsDateString } from "./formatAwsDateString";
import { CreatePlantInput, UpdatePlantInput } from "src/gen/API";

const untransformedProperties = [
  "name",
  "wateringPeriodInDays",
  "fertilizingPeriodInDays",
] as const;

export type NewPlant = Omit<Plant, "createdAt" | "owner" | "events" | "id">;

function transformDates(
  input: NewPlant,
): Pick<
  CreatePlantInput,
  | "lastFertilizedAt"
  | "fertilizeNextAt"
  | "lastWateredAt"
  | "waterNextAt"
  | "timeOfDeath"
> {
  return {
    timeOfDeath: dateToString(input.timeOfDeath),
    lastWateredAt: dateToString(input.lastWateredAt),
    waterNextAt: formatAwsDateString(input.waterNextAt),
    lastFertilizedAt: dateToString(input.lastFertilizedAt),
    fertilizeNextAt: formatAwsDateString(input.fertilizeNextAt),
  };
}

export function plantToCreatePlantInput(input: NewPlant): CreatePlantInput {
  return {
    ...pick(input, untransformedProperties),
    ...transformDates(input),
  };
}

export function plantToUpdatePlantInput(input: Plant): UpdatePlantInput {
  return {
    ...pick(input, [...untransformedProperties, "id"]),
    ...transformDates(input),
  };
}
