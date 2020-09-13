/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePlantInput = {
  id?: string | null;
  name: string;
  timeOfDeath?: string | null;
  lastWateredAt?: string | null;
  wateringPeriodInDays: number;
};

export type ModelPlantConditionInput = {
  name?: ModelStringInput | null;
  timeOfDeath?: ModelStringInput | null;
  lastWateredAt?: ModelStringInput | null;
  wateringPeriodInDays?: ModelIntInput | null;
  and?: Array<ModelPlantConditionInput | null> | null;
  or?: Array<ModelPlantConditionInput | null> | null;
  not?: ModelPlantConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type UpdatePlantInput = {
  id: string;
  name?: string | null;
  timeOfDeath?: string | null;
  lastWateredAt?: string | null;
  wateringPeriodInDays?: number | null;
};

export type DeletePlantInput = {
  id?: string | null;
};

export type CreatePlantEventInput = {
  id?: string | null;
  plantId: string;
  type: PlantEventType;
  createdAt?: string | null;
};

export enum PlantEventType {
  WATERED = "WATERED",
}

export type ModelPlantEventConditionInput = {
  plantId?: ModelIDInput | null;
  type?: ModelPlantEventTypeInput | null;
  createdAt?: ModelStringInput | null;
  and?: Array<ModelPlantEventConditionInput | null> | null;
  or?: Array<ModelPlantEventConditionInput | null> | null;
  not?: ModelPlantEventConditionInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelPlantEventTypeInput = {
  eq?: PlantEventType | null;
  ne?: PlantEventType | null;
};

export type UpdatePlantEventInput = {
  id: string;
  plantId?: string | null;
  type?: PlantEventType | null;
  createdAt?: string | null;
};

export type DeletePlantEventInput = {
  id?: string | null;
};

export type ModelPlantFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  timeOfDeath?: ModelStringInput | null;
  lastWateredAt?: ModelStringInput | null;
  wateringPeriodInDays?: ModelIntInput | null;
  and?: Array<ModelPlantFilterInput | null> | null;
  or?: Array<ModelPlantFilterInput | null> | null;
  not?: ModelPlantFilterInput | null;
};

export type ModelPlantEventFilterInput = {
  id?: ModelIDInput | null;
  plantId?: ModelIDInput | null;
  type?: ModelPlantEventTypeInput | null;
  createdAt?: ModelStringInput | null;
  and?: Array<ModelPlantEventFilterInput | null> | null;
  or?: Array<ModelPlantEventFilterInput | null> | null;
  not?: ModelPlantEventFilterInput | null;
};

export type CreatePlantMutationVariables = {
  input: CreatePlantInput;
  condition?: ModelPlantConditionInput | null;
};

export type CreatePlantMutation = {
  createPlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type UpdatePlantMutationVariables = {
  input: UpdatePlantInput;
  condition?: ModelPlantConditionInput | null;
};

export type UpdatePlantMutation = {
  updatePlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type DeletePlantMutationVariables = {
  input: DeletePlantInput;
  condition?: ModelPlantConditionInput | null;
};

export type DeletePlantMutation = {
  deletePlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type CreatePlantEventMutationVariables = {
  input: CreatePlantEventInput;
  condition?: ModelPlantEventConditionInput | null;
};

export type CreatePlantEventMutation = {
  createPlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type UpdatePlantEventMutationVariables = {
  input: UpdatePlantEventInput;
  condition?: ModelPlantEventConditionInput | null;
};

export type UpdatePlantEventMutation = {
  updatePlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type DeletePlantEventMutationVariables = {
  input: DeletePlantEventInput;
  condition?: ModelPlantEventConditionInput | null;
};

export type DeletePlantEventMutation = {
  deletePlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type GetPlantQueryVariables = {
  id: string;
};

export type GetPlantQuery = {
  getPlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type ListPlantsQueryVariables = {
  filter?: ModelPlantFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPlantsQuery = {
  listPlants: {
    __typename: "ModelPlantConnection";
    items: Array<{
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type GetPlantEventQueryVariables = {
  id: string;
};

export type GetPlantEventQuery = {
  getPlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type ListPlantEventsQueryVariables = {
  filter?: ModelPlantEventFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPlantEventsQuery = {
  listPlantEvents: {
    __typename: "ModelPlantEventConnection";
    items: Array<{
      __typename: "PlantEvent";
      id: string;
      plantId: string;
      type: PlantEventType;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    } | null> | null;
    nextToken: string | null;
  } | null;
};

export type OnCreatePlantSubscriptionVariables = {
  owner: string;
};

export type OnCreatePlantSubscription = {
  onCreatePlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type OnUpdatePlantSubscriptionVariables = {
  owner: string;
};

export type OnUpdatePlantSubscription = {
  onUpdatePlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type OnDeletePlantSubscriptionVariables = {
  owner: string;
};

export type OnDeletePlantSubscription = {
  onDeletePlant: {
    __typename: "Plant";
    id: string;
    name: string;
    timeOfDeath: string | null;
    lastWateredAt: string | null;
    wateringPeriodInDays: number;
    events: {
      __typename: "ModelPlantEventConnection";
      nextToken: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type OnCreatePlantEventSubscriptionVariables = {
  owner: string;
};

export type OnCreatePlantEventSubscription = {
  onCreatePlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type OnUpdatePlantEventSubscriptionVariables = {
  owner: string;
};

export type OnUpdatePlantEventSubscription = {
  onUpdatePlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};

export type OnDeletePlantEventSubscriptionVariables = {
  owner: string;
};

export type OnDeletePlantEventSubscription = {
  onDeletePlantEvent: {
    __typename: "PlantEvent";
    id: string;
    plantId: string;
    plant: {
      __typename: "Plant";
      id: string;
      name: string;
      timeOfDeath: string | null;
      lastWateredAt: string | null;
      wateringPeriodInDays: number;
      createdAt: string;
      updatedAt: string;
      owner: string | null;
    };
    type: PlantEventType;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null;
};
