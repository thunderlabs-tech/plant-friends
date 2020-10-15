import { pick } from "lodash";
import formatAwsDateTimeString from "src/utilities/graphql/formatAwsDateTimeString";
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
    timeOfDeath: formatAwsDateTimeString(input.timeOfDeath),
    lastWateredAt: formatAwsDateTimeString(input.lastWateredAt),
    waterNextAt: formatAwsDateString(input.waterNextAt),
    lastFertilizedAt: formatAwsDateTimeString(input.lastFertilizedAt),
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
