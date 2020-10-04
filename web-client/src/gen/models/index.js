// @ts-check
import { initSchema } from "@aws-amplify/datastore";
import { schema } from "./schema";

const PlantEventType = {
  WATERED: "WATERED",
  FERTILIZED: "FERTILIZED",
};

const { Plant, PlantEvent } = initSchema(schema);

export { Plant, PlantEvent, PlantEventType };
