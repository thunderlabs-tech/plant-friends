export enum PlantEventType {
  WATERED = "WATERED",
}

type PlantEvent = {
  _id: string;
  type: PlantEventType;
  createdAt: Date;
};

export default PlantEvent;
