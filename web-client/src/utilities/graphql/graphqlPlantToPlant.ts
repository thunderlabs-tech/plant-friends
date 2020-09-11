import { Plant } from "../../data/Plant";
import { pick } from "lodash";

import { parseDateString } from "./parseDateString";
import { ListPlantsQuery } from "../../gen/API";
import { QueryResultItem } from "./QueryTypes";

const PlantProperties = Object.freeze([
  "id",
  "name",
  "timeOfDeath",
  "lastWateredAt",
  "wateringPeriodInDays",
  "userId",
] as const);

export type GraphqlPlant = QueryResultItem<ListPlantsQuery["listPlants"]>;

export default function graphqlPlantToPlant(item: GraphqlPlant): Plant {
  return {
    ...pick(item, PlantProperties),
    lastWateredAt: parseDateString(item.lastWateredAt),
    timeOfDeath: parseDateString(item.timeOfDeath),
    events: [],
  };
}
