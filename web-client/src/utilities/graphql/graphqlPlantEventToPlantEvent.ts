import { pick } from "lodash";
import { ListPlantEventsQuery } from "src/gen/API";
import { QueryResultItem } from "src/utilities/graphql/QueryTypes";
import PlantEvent from "src/data/PlantEvent";
import { parseDateString } from "./parseDateString";

const PlantEventProperties = Object.freeze([
  "id",
  "plantId",
  "type",
  "createdAt",
] as const);

export type GraphqlPlantEvent = QueryResultItem<
  ListPlantEventsQuery["listPlantEvents"]
>;

export default function graphqlPlantEventToPlantEvent(
  item: GraphqlPlantEvent,
): PlantEvent {
  const values = pick(item, PlantEventProperties);
  return {
    ...values,
    createdAt: parseDateString(values.createdAt),
  };
}
