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
] as const);

export type GraphqlPlant = QueryResultItem<ListPlantsQuery["listPlants"]>;

export default function graphqlPlantToPlant(item: GraphqlPlant): Plant {
  const values = pick(item, PlantProperties);
  return {
    ...values,
    lastWateredAt: parseDateString(item.lastWateredAt),
    timeOfDeath: parseDateString(item.timeOfDeath),
    events: [],
  };
}
