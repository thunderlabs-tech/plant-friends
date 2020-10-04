import { pick } from "lodash";
import dateToString from "src/utilities/graphql/dateToString";
import { Plant } from "src/data/Plant";

export default function plantToGraphqlPlant(
  input: Plant,
): Pick<
  Plant,
  "id" | "name" | "wateringPeriodInDays" | "fertilizingPeriodInDays"
> & {
  lastWateredAt: string | null;
  lastFertilizedAt: string | null;
  timeOfDeath: string | null;
} {
  return {
    ...pick(input, [
      "id",
      "name",
      "wateringPeriodInDays",
      "fertilizingPeriodInDays",
    ]),
    timeOfDeath: dateToString(input.timeOfDeath),
    lastWateredAt: dateToString(input.lastWateredAt),
    lastFertilizedAt: dateToString(input.lastFertilizedAt),
  };
}
