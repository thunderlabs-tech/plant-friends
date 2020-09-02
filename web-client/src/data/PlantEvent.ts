export enum PlantEventType {
  WATERED = "WATERED",
}

type PlantEvent = {
  id: string;
  type: PlantEventType;
  createdAt: Date;
};

export default PlantEvent;
