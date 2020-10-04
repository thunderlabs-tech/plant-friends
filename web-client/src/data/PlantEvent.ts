import { PlantEventType } from "src/gen/API";

type PlantEvent = {
  id: string;
  plantId: string;
  type: PlantEventType;
  createdAt: Date;
};

export default PlantEvent;
