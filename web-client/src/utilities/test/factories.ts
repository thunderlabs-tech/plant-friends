import { Plant } from "src/data/Plant";
import { uniqueId } from "lodash";
import PlantEvent from "src/data/PlantEvent";
import { PlantEventType } from "src/gen/API";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    id: uniqueId(),
    name: "Basil",
    wateringPeriodInDays: 1,
    fertilizingPeriodInDays: 1,
    timeOfDeath: null,
    createdAt: new Date(),
    events: [],
    lastWateredAt: null,
    lastFertilizedAt: null,
    ...attributes,
  };
}

export function makePlantEvent(
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
