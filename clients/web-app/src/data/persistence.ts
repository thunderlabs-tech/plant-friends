import localforage from "localforage";
import { Plant } from "./Plant";
import { runMigrations } from "./migrations";
import { DataExport } from "./exportData";
import { Override } from "../utilities/lang/Override";
import { omit } from "lodash";

const faunaDBUrl = "https://graphql.fauna.com/graphql";
const faunaDBAuthorizationToken = "fnADwAeakMACB0RddDaChuq-Tl9eaSXhQvLqOaqD";

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

type JSONSerializableScalarValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Date
  | JSONSerializableScalarValue[];
type JSONSerializableValue =
  | { [key: string]: JSONSerializableValue }
  | JSONSerializableScalarValue;

export type FaunaDBSerializedPlant = Override<
  Plant,
  {
    wateringTimes: string[];
    timeOfDeath: string | null;
  }
>;

function deserializeDate(iso8601DateString: string): Date {
  return new Date(Date.parse(iso8601DateString));
}
function deserializeFaunaDBPlant(
  serializedPlant: FaunaDBSerializedPlant,
): Plant {
  return {
    ...serializedPlant,
    wateringTimes: serializedPlant.wateringTimes.map(deserializeDate),
    timeOfDeath: serializedPlant.timeOfDeath
      ? deserializeDate(serializedPlant.timeOfDeath)
      : null,
  };
}

async function faunaDBQuery<SuccessResponse = unknown>(request: {
  query: string;
  variables?: { [key: string]: JSONSerializableValue };
}): Promise<SuccessResponse> {
  const response = await fetch(faunaDBUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${faunaDBAuthorizationToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const result = (await response.json()) as
    | SuccessResponse
    | GraphQLErrorResponse;

  return assertSuccessfulResponse(result);
}

localforage.config({
  name: "plant-friends",
  version: 1.1,
});

const namespace = process.env.NODE_ENV;

function storageKey(key: string): string {
  return `${namespace}-${key}`;
}

function getItem<T>(key: string): Promise<T> {
  return localforage.getItem<T>(storageKey(key));
}

export type setItemType = <T>(key: string, value: T) => Promise<T>;
function setItem<T>(key: string, value: T): Promise<T> {
  return localforage.setItem<T>(storageKey(key), value);
}

function removeItem(key: string): Promise<void> {
  return localforage.removeItem(storageKey(key));
}

async function getIdCounter(): Promise<number> {
  return (await getItem<number | undefined>("id-counter")) || 0;
}

export const LOCAL_STORAGE_KEYS = {
  NEXT_MIGRATION_INDEX_KEY: "next-migration-index",
  USER_ID_KEY: "user-id",
};

export async function getNextMigrationIndex(): Promise<number> {
  return (
    (await getItem<number | undefined>(
      LOCAL_STORAGE_KEYS.NEXT_MIGRATION_INDEX_KEY,
    )) || 0
  );
}

export async function setNextMigrationIndex(value: number): Promise<void> {
  await setItem<number>(LOCAL_STORAGE_KEYS.NEXT_MIGRATION_INDEX_KEY, value);
}

function getUserId(): Promise<string> {
  return getItem<string>(LOCAL_STORAGE_KEYS.USER_ID_KEY);
}

export class IncompatibleImportError extends Error {}

export type NewPlant = Omit<Plant, "_id" | "userId">;

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem, ...LOCAL_STORAGE_KEYS });
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
          }
        }
      }
    `;

    const response = await faunaDBQuery<{
      data: { getPlants: { data: FaunaDBSerializedPlant[] } };
    }>({ query, variables: { userId } });

    return response.data.getPlants.data.map(deserializeFaunaDBPlant);
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
    }>({ query, variables: { id: plant._id, data: omit(plant, "_id") } });

    return persistence.loadPlants();
  },

  createPlant: async (newPlant: NewPlant): Promise<Plant[]> => {
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
      removeItem(LOCAL_STORAGE_KEYS.NEXT_MIGRATION_INDEX_KEY),
      removeItem(LOCAL_STORAGE_KEYS.USER_ID_KEY),
    ]);

    window.location.reload();
  },

  getDataForExport: async (): Promise<DataExport> => {
    const [idCounter, nextMigrationIndex, plants] = await Promise.all([
      getIdCounter(),
      getNextMigrationIndex(),
      persistence.loadPlants(),
    ]);

    return {
      idCounter,
      nextMigrationIndex,
      plants: plants.map((plant) => omit(plant, "_id")),
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
