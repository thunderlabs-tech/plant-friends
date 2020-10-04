import { Plant } from "src/data/Plant";
import { uniqueId } from "lodash";
import PlantEvent from "src/data/PlantEvent";
import { PlantEventType } from "src/gen/API";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    id: uniqueId(),
    name: "Basil",
    wateringPeriodInDays: 1,
    timeOfDeath: null,
    createdAt: new Date(),
    events: [],
    lastWateredAt: null,
    ...attributes,
  };
}

export function makeWateredEvent(
  attributes: Partial<PlantEvent> = {},
): PlantEvent {
  return {
    id: uniqueId(),
    plantId: uniqueId(),
    type: PlantEventType.WATERED,
    createdAt: new Date(),
    ...attributes,
  };
}
