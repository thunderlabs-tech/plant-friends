/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlant = /* GraphQL */ `
  query GetPlant($id: ID!) {
    getPlant(id: $id) {
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
export const listPlants = /* GraphQL */ `
  query ListPlants(
    $filter: ModelPlantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        timeOfDeath
        lastWateredAt
        wateringPeriodInDays
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getPlantEvent = /* GraphQL */ `
  query GetPlantEvent($id: ID!) {
    getPlantEvent(id: $id) {
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
export const listPlantEvents = /* GraphQL */ `
  query ListPlantEvents(
    $filter: ModelPlantEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlantEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        plantId
        type
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
