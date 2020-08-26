type PlantEvent = {
  _id: string;
  type: PlantEventType;
  createdAt: Date;
};

export default PlantEvent;

export enum PlantEventType {
  WATERED = "WATERED",
}
