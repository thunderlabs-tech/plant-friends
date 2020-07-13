export type PlantEvent = {
  _id: string;
  type: PlantEventType;
  createdAt: Date;
};

export enum PlantEventType {
  WATERED = "WATERED",
}
