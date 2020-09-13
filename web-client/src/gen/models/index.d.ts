import {
  ModelInit,
  MutableModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";

export enum PlantEventType {
  WATERED = "WATERED",
}

export declare class Plant {
  readonly id: string;
  readonly name: string;
  readonly timeOfDeath?: string;
  readonly lastWateredAt?: string;
  readonly wateringPeriodInDays: number;
  readonly events: PlantEvent[];
  constructor(init: ModelInit<Plant>);
  static copyOf(
    source: Plant,
    mutator: (draft: MutableModel<Plant>) => MutableModel<Plant> | void,
  ): Plant;
}

export declare class PlantEvent {
  readonly id: string;
  readonly plant: Plant;
  readonly type: PlantEventType | keyof typeof PlantEventType;
  readonly createdAt: string;
  constructor(init: ModelInit<PlantEvent>);
  static copyOf(
    source: PlantEvent,
    mutator: (
      draft: MutableModel<PlantEvent>,
    ) => MutableModel<PlantEvent> | void,
  ): PlantEvent;
}
