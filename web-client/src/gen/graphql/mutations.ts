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
      lastFertilizedAt
      wateringPeriodInDays
      fertilizingPeriodInDays
      events {
        nextToken
        startedAt
      }
      waterNextAt
      fertilizeNextAt
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      lastFertilizedAt
      wateringPeriodInDays
      fertilizingPeriodInDays
      events {
        nextToken
        startedAt
      }
      waterNextAt
      fertilizeNextAt
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      lastFertilizedAt
      wateringPeriodInDays
      fertilizingPeriodInDays
      events {
        nextToken
        startedAt
      }
      waterNextAt
      fertilizeNextAt
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      type
      createdAt
      owner
      _version
      _deleted
      _lastChangedAt
      updatedAt
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
      type
      createdAt
      owner
      _version
      _deleted
      _lastChangedAt
      updatedAt
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
      type
      createdAt
      owner
      _version
      _deleted
      _lastChangedAt
      updatedAt
    }
  }
`;
