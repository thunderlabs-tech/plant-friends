export enum PlantEventType {
  WATERED = "WATERED",
}

type PlantEvent = {
  id: string;
  plantId: string;
  type: PlantEventType;
  createdAt: Date;
};

export default PlantEvent;
