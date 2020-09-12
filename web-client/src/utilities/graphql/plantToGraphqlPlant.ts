import { pick } from "lodash";
import dateToString from "./dateToString";
import { Plant } from "../../data/Plant";

export default function plantToGraphqlPlant(
  input: Plant,
): Pick<Plant, "id" | "name" | "wateringPeriodInDays"> & {
  lastWateredAt: string | null;
  timeOfDeath: string | null;
} {
  return {
    ...pick(input, ["id", "name", "wateringPeriodInDays"]),
    timeOfDeath: dateToString(input.timeOfDeath),
    lastWateredAt: dateToString(input.lastWateredAt),
  };
}
