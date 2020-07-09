import localforage from "localforage";
import { Plant } from "./Plant";
import { runMigrations } from "./migrations";
import { DataExport } from "./exportData";

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

async function faunaDBQuery<SuccessResponse = unknown>(request: {
  query: string;
  variables?: { [key: string]: string | number | boolean | undefined | null };
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

async function setIdCounter(nextId: number): Promise<number> {
  return setItem<number>("id-counter", nextId);
}

async function getNextId(): Promise<string> {
  const idCounter: number = await getIdCounter();

  const nextId = idCounter + 1;
  setIdCounter(nextId);
  return nextId.toString();
}

export const LOCAL_STORAGE_KEYS = {
  ID_COUNTER_KEY: "id-counter",
  PLANTS_KEY: "plants",
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

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem, ...LOCAL_STORAGE_KEYS });
  },

  loadPlants: async (): Promise<Plant[]> => {
    const userId = await getUserId();
    const query = /* GraphQL */ `
      query($userId: String) {
        getPlants(userId: $userId) {
          data {
            name
            _id
            timeOfDeath
            wateringPeriodInDays
            wateringTimes
          }
        }
      }
    `;

    const response = await faunaDBQuery<{
      data: { getPlants: { data: Plant[] } };
    }>({ query, variables: { userId } });

    return response.data.getPlants.data;
  },

  storePlants: (plants: Plant[]): Promise<Plant[]> => {
    return setItem<Plant[]>(LOCAL_STORAGE_KEYS.PLANTS_KEY, plants);
  },

  updatePlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();
    const plantIndex = allPlants.findIndex(
      (element) => element._id === plant._id,
    );
    if (plantIndex === -1)
      throw new Error(`Plant with ID ${plant._id} not found`);
    const newPlants = [
      ...allPlants.slice(0, plantIndex),
      plant,
      ...allPlants.slice(plantIndex + 1),
    ];
    return persistence.storePlants(newPlants);
  },
  removePlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();

    const newPlants = allPlants.filter((element) => element._id !== plant._id);

    return persistence.storePlants(newPlants);
  },

  addPlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();

    const newPlants = [...allPlants, plant];

    return persistence.storePlants(newPlants);
  },

  createPlant: async (
    plantDescriptor: Omit<Plant, "_id">,
  ): Promise<Plant[]> => {
    const newPlant: Plant = { ...plantDescriptor, _id: await getNextId() };
    return persistence.addPlant(newPlant);
  },

  batchCreatePlants: async (
    plantDescriptors: Omit<Plant, "_id">[],
  ): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();
    let idCounter = await getIdCounter();

    const newPlants: Plant[] = plantDescriptors.map((plantDescriptor) => {
      idCounter += 1;
      return { ...plantDescriptor, _id: idCounter.toString() };
    });

    await setIdCounter(idCounter);

    return persistence.storePlants([...allPlants, ...newPlants]);
  },

  deleteAll: async (): Promise<void> => {
    await Promise.all([
      removeItem(LOCAL_STORAGE_KEYS.NEXT_MIGRATION_INDEX_KEY),
      removeItem(LOCAL_STORAGE_KEYS.PLANTS_KEY),
      removeItem(LOCAL_STORAGE_KEYS.ID_COUNTER_KEY),
      removeItem(LOCAL_STORAGE_KEYS.USER_ID_KEY),
    ]);
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
      plants,
    };
  },

  persistImportedData: async (importedData: DataExport): Promise<Plant[]> => {
    const ourMigrationIndex = await getNextMigrationIndex();

    if (ourMigrationIndex !== importedData.nextMigrationIndex) {
      throw new IncompatibleImportError(
        `Import is from a different version of the app (${importedData.nextMigrationIndex} when it should be ${ourMigrationIndex})`,
      );
    }

    await Promise.all([
      setNextMigrationIndex(importedData.nextMigrationIndex),
      setIdCounter(importedData.idCounter),
      persistence.storePlants(importedData.plants),
    ]);

    return importedData.plants;
  },
};
export type Persistence = typeof persistence;

export default persistence;
