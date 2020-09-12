import { v4 as uuidv4 } from "uuid";
import { Plant } from "../../data/Plant";
import { uniqueId } from "lodash";
import PlantEvent, { PlantEventType } from "../../data/PlantEvent";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    id: uniqueId(),
    name: "Basil",
    wateringPeriodInDays: 1,
    timeOfDeath: null,
    userId: uuidv4(),
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
