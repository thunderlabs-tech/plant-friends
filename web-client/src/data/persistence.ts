import localforage from "localforage";
import { Plant, PlantInput } from "./Plant";
import { runMigrations } from "./migrations";
import { DataExport } from "./exportData";
import { pick } from "lodash";
import deserializeDateStrings from "../utilities/deserializeDateStrings";
import JsonValue from "../utilities/JsonValue";
import castAs from "../utilities/lang/castAs";
import PlantEvent from "./PlantEvent";

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

function getItem<T>(key: string): Promise<T | null> {
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
  return (await getItem<number>(localStorageKeys.nextMigrationIndex)) || 0;
}

export async function setNextMigrationIndex(value: number): Promise<void> {
  await setItem<number>(localStorageKeys.nextMigrationIndex, value);
}

export class IncompatibleImportError extends Error {}

type Page<T> = {
  data: T[];
  before: string | null;
  after: string | null;
};

const allPlantFields = Object.freeze(`
id
name
timeOfDeath
wateringPeriodInDays
userId
lastWateredAt
events {
  data {
    id
    type
    createdAt
  }
}`);

async function createPlantWithEvents(
  newPlant: Omit<PlantInput, "userId">,
  events: Pick<PlantEvent, "type" | "createdAt">[],
): Promise<Plant[]> {
  let userId = await persistence.getUserId();

  const query = /* GraphQL */ `
    mutation($data: PlantInput!) {
      createPlant(data: $data) {
        ${allPlantFields}
      }
    }
  `;

  await faunaDBQuery<{
    data: { createPlant: Plant };
  }>({
    query,
    variables: {
      data: {
        ...newPlant,
        userId,
        events: {
          create: events,
        },
      },
      events,
    },
  });

  return persistence.loadPlants();
}

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem, userIdKey: localStorageKeys.userId });
  },

  loadPlants: async (): Promise<Plant[]> => {
    const userId = await persistence.getUserId();
    const query = /* GraphQL */ `
      query($_cursor: String, $userId: String!) {
        getPlants(_size: 100, _cursor: $_cursor, userId: $userId) {
          data {
            ${allPlantFields}
          },
          after,
        }
      }
    `;

    function fetchNextPage(cursor?: string) {
      return faunaDBQuery<{
        data: { getPlants: Page<Plant> };
      }>({ query, variables: { _cursor: cursor, userId } });
    }

    let latestResponse = await fetchNextPage();
    let { data: plants, after: cursor } = latestResponse.data.getPlants;

    while (cursor !== null) {
      latestResponse = await fetchNextPage(cursor);
      plants = plants.concat(latestResponse.data.getPlants.data);
      cursor = latestResponse.data.getPlants.after;
    }

    return plants;
  },

  updatePlant: async (plant: Plant): Promise<Plant> => {
    const query = /* GraphQL */ `
      mutation($id: ID!, $data: PlantInput!) {
        updatePlant(id: $id, data: $data) {
          ${allPlantFields}
        }
      }
    `;

    const result = await faunaDBQuery<{
      data: { updatePlant: Plant };
    }>({
      query,
      variables: {
        id: plant.id,
        data: castAs<PlantInput>(
          pick(plant, "name", "timeOfDeath", "wateringPeriodInDays", "userId"),
        ),
      },
    });

    return result.data.updatePlant;
  },

  waterPlant: async (plant: Plant): Promise<Plant> => {
    const query = /* GraphQL */ `
      mutation($plantId: ID!, $at: Time!) {
        waterPlant(plantId: $plantId, at: $at) {
          ${allPlantFields}
        }
      }
    `;

    const result = await faunaDBQuery<{
      data: { waterPlant: Plant };
    }>({
      query,
      variables: {
        plantId: plant.id,
        at: new Date(),
      },
    });

    return result.data.waterPlant;
  },

  createPlant: async (
    newPlant: Omit<PlantInput, "userId">,
  ): Promise<Plant[]> => {
    let userId = await persistence.getUserId();

    const query = /* GraphQL */ `
      mutation($data: PlantInput!) {
        createPlant(data: $data) {
          ${allPlantFields}
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
          id
        }
      }
    `;

    await faunaDBQuery<{
      data: { deletePlant: Plant };
    }>({ query, variables: { id: plant.id } });
  },

  deleteAll: async (): Promise<void> => {
    const plants = await persistence.loadPlants();

    for (let i = 0; i < plants.length; i += 1) {
      await persistence.deletePlant(plants[i]);
    }

    // TODO: delete events

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
      const plant = importedData.plants[i];
      await createPlantWithEvents(
        pick(
          plant,
          "name",
          "timeOfDeath",
          "lastWateredAt",
          "wateringPeriodInDays",
        ),
        plant.events.data.map((event) => pick(event, "type", "createdAt")),
      );
    }

    return persistence.loadPlants();
  },

  async getUserId(): Promise<string> {
    const userId = await getItem<string>(localStorageKeys.userId);
    if (userId === null) throw new Error("User ID missing from local storage");
    return userId;
  },

  async setUserId(value: string): Promise<void> {
    await setItem<string>(localStorageKeys.userId, value);
    window.location.reload();
  },
};
export type Persistence = typeof persistence;

export default persistence;
