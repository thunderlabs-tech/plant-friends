import { v4 as uuidv4 } from "uuid";
import { Plant } from "../../data/Plant";
import { uniqueId } from "lodash";
import { PlantEvent, PlantEventType } from "../../data/PlantEvent";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    _id: uniqueId(),
    name: "Basil",
    wateringPeriodInDays: 1,
    timeOfDeath: null,
    userId: uuidv4(),
    events: { data: [] },
    lastWateredAt: null,
    ...attributes,
  };
}

export function makeWateredEvent(
  attributes: Partial<PlantEvent> = {},
): PlantEvent {
  return {
    _id: uniqueId(),
    type: PlantEventType.WATERED,
    createdAt: new Date(),
    ...attributes,
  };
}
