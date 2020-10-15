/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncPlants = /* GraphQL */ `
  query SyncPlants(
    $filter: ModelPlantFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPlants(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        timeOfDeath
        lastWateredAt
        lastFertilizedAt
        wateringPeriodInDays
        fertilizingPeriodInDays
        waterNextAt
        fertilizeNextAt
        owner
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPlant = /* GraphQL */ `
  query GetPlant($id: ID!) {
    getPlant(id: $id) {
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
        lastFertilizedAt
        wateringPeriodInDays
        fertilizingPeriodInDays
        waterNextAt
        fertilizeNextAt
        owner
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPlantEvents = /* GraphQL */ `
  query SyncPlantEvents(
    $filter: ModelPlantEventFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPlantEvents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getPlantEvent = /* GraphQL */ `
  query GetPlantEvent($id: ID!) {
    getPlantEvent(id: $id) {
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
        owner
        _version
        _deleted
        _lastChangedAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
