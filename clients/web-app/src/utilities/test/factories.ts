import { Plant } from "../../data/Plant";

export function makePlant(attributes: Partial<Plant> = {}): Plant {
  return {
    _id: "1",
    name: "Basil",
    wateringPeriodInDays: 1,
    wateringTimes: [],
    timeOfDeath: null,
    ...attributes,
  };
}
