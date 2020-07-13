import localforage from "localforage";
import { Plant, PlantInput } from "./Plant";
import { runMigrations } from "./migrations";
import { DataExport } from "./exportData";
import { omit } from "lodash";
import deserializeDateStrings from "../utilities/deserializeDateStrings";
import JsonValue from "../utilities/JsonValue";
import castAs from "../utilities/lang/castAs";

const faunaDBUrl = "https://graphql.fauna.com/graphql";
const FAUNADB_ACCESS_TOKEN = process.env.REACT_APP_FAUNADB_ACCESS_TOKEN;

type GraphQLErrorResponse = {
  errors: { message: string }[];
};

function isGraphQLError(response: any): response is GraphQLErrorResponse {
  return Object.prototype.hasOwnProperty.call(response, "errors");
}

function assertSuccessfulResponse<SuccessType = unknown>(
  response: SuccessType | GraphQLErrorResponse,
): SuccessType {
  if (isGraphQLError(response)) {
    throw new Error(
      `Request failed: \n${response.errors
        .map((error) => error.message)
        .join("\n")}`,
    );
  }

  return response;
}

async function faunaDBQuery<SuccessResponse extends JsonValue>(request: {
  query: string;
  variables?: { [key: string]: JsonValue };
}): Promise<SuccessResponse> {
  const response = await fetch(faunaDBUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FAUNADB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const resultOrError = (await response.json()) as
    | SuccessResponse
    | GraphQLErrorResponse;

  const result = assertSuccessfulResponse(resultOrError);
  return deserializeDateStrings(result);
}

localforage.config({
  name: "plant-friends",
  version: 1.1,
});

function getItem<T>(key: string): Promise<T> {
  return localforage.getItem<T>(key);
}

export type setItemType = <T>(key: string, value: T) => Promise<T>;
function setItem<T>(key: string, value: T): Promise<T> {
  return localforage.setItem<T>(key, value);
}

function removeItem(key: string): Promise<void> {
  return localforage.removeItem(key);
}

export const localStorageKeys = Object.freeze({
  nextMigrationIndex: "next-migration-index",
  userId: "user-id",
});

export async function getNextMigrationIndex(): Promise<number> {
  return (
    (await getItem<number | undefined>(localStorageKeys.nextMigrationIndex)) ||
    0
  );
}

export async function setNextMigrationIndex(value: number): Promise<void> {
  await setItem<number>(localStorageKeys.nextMigrationIndex, value);
}

function getUserId(): Promise<string> {
  return getItem<string>(localStorageKeys.userId);
}

export class IncompatibleImportError extends Error {}

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem, userIdKey: localStorageKeys.userId });
  },

  loadPlants: async (): Promise<Plant[]> => {
    const userId = await getUserId();
    const query = /* GraphQL */ `
      query($userId: String!) {
        getPlants(userId: $userId) {
          data {
            _id
            name
            timeOfDeath
            wateringPeriodInDays
            wateringTimes
            userId
            events {
              data {
                _id
                type
                createdAt
              }
            }
          }
        }
      }
    `;

    const response = await faunaDBQuery<{
      data: { getPlants: { data: Plant[] } };
    }>({ query, variables: { userId } });

    return response.data.getPlants.data;
  },

  updatePlant: async (plant: Plant): Promise<Plant[]> => {
    const query = /* GraphQL */ `
      mutation($id: ID!, $data: PlantInput!) {
        updatePlant(id: $id, data: $data) {
          _id
          name
          timeOfDeath
          wateringPeriodInDays
          wateringTimes
          userId
        }
      }
    `;

    await faunaDBQuery<{
      data: { updatePlant: Plant };
    }>({
      query,
      variables: {
        id: plant._id,
        data: castAs<PlantInput>(omit(plant, "_id")),
      },
    });

    return persistence.loadPlants();
  },

  createPlant: async (
    newPlant: Omit<PlantInput, "userId">,
  ): Promise<Plant[]> => {
    let userId = await getUserId();

    const query = /* GraphQL */ `
      mutation($data: PlantInput!) {
        createPlant(data: $data) {
          _id
          name
          timeOfDeath
          wateringPeriodInDays
          wateringTimes
          userId
        }
      }
    `;

    await faunaDBQuery<{
      data: { createPlant: Plant };
    }>({ query, variables: { data: { ...newPlant, userId } } });

    return persistence.loadPlants();
  },

  deletePlant: async (plant: Plant): Promise<void> => {
    const query = /* GraphQL */ `
      mutation($id: ID!) {
        deletePlant(id: $id) {
          _id
        }
      }
    `;

    await faunaDBQuery<{
      data: { deletePlant: Plant };
    }>({ query, variables: { id: plant._id } });
  },

  deleteAll: async (): Promise<void> => {
    const plants = await persistence.loadPlants();

    for (let i = 0; i < plants.length; i += 1) {
      await persistence.deletePlant(plants[i]);
    }

    // TODO: delete remote data and update description in UI
    await Promise.all([
      removeItem(localStorageKeys.nextMigrationIndex),
      removeItem(localStorageKeys.userId),
    ]);

    window.location.reload();
  },

  getDataForExport: async (): Promise<DataExport> => {
    const [nextMigrationIndex, plants] = await Promise.all([
      getNextMigrationIndex(),
      persistence.loadPlants(),
    ]);

    return {
      nextMigrationIndex,
      plants: plants,
    };
  },

  persistImportedData: async (importedData: DataExport): Promise<Plant[]> => {
    const ourMigrationIndex = await getNextMigrationIndex();

    if (ourMigrationIndex !== importedData.nextMigrationIndex) {
      throw new IncompatibleImportError(
        `Import is from a different version of the app (${importedData.nextMigrationIndex} when it should be ${ourMigrationIndex})`,
      );
    }

    for (let i = 0; i < importedData.plants.length; i += 1) {
      await persistence.createPlant(importedData.plants[i]);
    }

    return persistence.loadPlants();
  },
};
export type Persistence = typeof persistence;

export default persistence;
