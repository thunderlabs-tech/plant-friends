import { v4 as uuidv4 } from "uuid";
import { Plant } from "../../data/Plant";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    _id: "1",
    name: "Basil",
    wateringPeriodInDays: 1,
    wateringTimes: [],
    timeOfDeath: null,
    userId: uuidv4(),
    events: [],
    lastWateredAt: null,
    ...attributes,
  };
}
