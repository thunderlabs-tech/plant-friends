/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlant = /* GraphQL */ `
  subscription OnCreatePlant($owner: String!) {
    onCreatePlant(owner: $owner) {
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
export const onUpdatePlant = /* GraphQL */ `
  subscription OnUpdatePlant($owner: String!) {
    onUpdatePlant(owner: $owner) {
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
export const onDeletePlant = /* GraphQL */ `
  subscription OnDeletePlant($owner: String!) {
    onDeletePlant(owner: $owner) {
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
export const onCreatePlantEvent = /* GraphQL */ `
  subscription OnCreatePlantEvent($owner: String!) {
    onCreatePlantEvent(owner: $owner) {
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
export const onUpdatePlantEvent = /* GraphQL */ `
  subscription OnUpdatePlantEvent($owner: String!) {
    onUpdatePlantEvent(owner: $owner) {
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
export const onDeletePlantEvent = /* GraphQL */ `
  subscription OnDeletePlantEvent($owner: String!) {
    onDeletePlantEvent(owner: $owner) {
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
