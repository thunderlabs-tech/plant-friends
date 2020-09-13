/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlant = /* GraphQL */ `
  mutation CreatePlant(
    $input: CreatePlantInput!
    $condition: ModelPlantConditionInput
  ) {
    createPlant(input: $input, condition: $condition) {
      id
      name
      timeOfDeath
      lastWateredAt
      wateringPeriodInDays
      events {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updatePlant = /* GraphQL */ `
  mutation UpdatePlant(
    $input: UpdatePlantInput!
    $condition: ModelPlantConditionInput
  ) {
    updatePlant(input: $input, condition: $condition) {
      id
      name
      timeOfDeath
      lastWateredAt
      wateringPeriodInDays
      events {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deletePlant = /* GraphQL */ `
  mutation DeletePlant(
    $input: DeletePlantInput!
    $condition: ModelPlantConditionInput
  ) {
    deletePlant(input: $input, condition: $condition) {
      id
      name
      timeOfDeath
      lastWateredAt
      wateringPeriodInDays
      events {
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPlantEvent = /* GraphQL */ `
  mutation CreatePlantEvent(
    $input: CreatePlantEventInput!
    $condition: ModelPlantEventConditionInput
  ) {
    createPlantEvent(input: $input, condition: $condition) {
      id
      plantId
      plant {
        id
        name
        timeOfDeath
        lastWateredAt
        wateringPeriodInDays
        createdAt
        updatedAt
        owner
      }
      type
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updatePlantEvent = /* GraphQL */ `
  mutation UpdatePlantEvent(
    $input: UpdatePlantEventInput!
    $condition: ModelPlantEventConditionInput
  ) {
    updatePlantEvent(input: $input, condition: $condition) {
      id
      plantId
      plant {
        id
        name
        timeOfDeath
        lastWateredAt
        wateringPeriodInDays
        createdAt
        updatedAt
        owner
      }
      type
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deletePlantEvent = /* GraphQL */ `
  mutation DeletePlantEvent(
    $input: DeletePlantEventInput!
    $condition: ModelPlantEventConditionInput
  ) {
    deletePlantEvent(input: $input, condition: $condition) {
      id
      plantId
      plant {
        id
        name
        timeOfDeath
        lastWateredAt
        wateringPeriodInDays
        createdAt
        updatedAt
        owner
      }
      type
      createdAt
      updatedAt
      owner
    }
  }
`;
