import { Plant } from "src/data/Plant";
import { uniqueId } from "lodash";
import PlantEvent, { PlantEventType } from "src/data/PlantEvent";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    id: uniqueId(),
    name: "Basil",
    wateringPeriodInDays: 1,
    timeOfDeath: null,
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
