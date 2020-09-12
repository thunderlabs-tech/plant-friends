import localforage from "localforage";
import { Plant, PlantInput } from "./Plant";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

import { runMigrations } from "./migrations";
import { DataExport } from "./exportData";
import { omit } from "lodash";
import * as queries from "../gen/graphql/queries";
import * as mutations from "../gen/graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import blindCast from "../utilities/lang/blindCast";
import {
  ListPlantsQuery,
  DeletePlantInput,
  UpdatePlantMutation,
  UpdatePlantMutationVariables,
  ListPlantsQueryVariables,
  CreatePlantEventMutation,
  CreatePlantEventMutationVariables,
  PlantEventType,
  CreatePlantMutation,
  CreatePlantMutationVariables,
} from "../gen/API";
import {
  GraphqlResult,
  assertGraphqlSuccessResult,
} from "../utilities/graphql/GraphqlResult";
import { filterNull } from "../utilities/filterNull";
import graphqlPlantToPlant from "../utilities/graphql/graphqlPlantToPlant";
import assertPresent from "../utilities/lang/assertPresent";
import { QueryResultItems } from "../utilities/graphql/QueryTypes";
import plantToGraphqlPlant from "../utilities/graphql/plantToGraphqlPlant";
import dateToString from "../utilities/graphql/dateToString";

type GraphqlOptions<Variables extends object> = {
  query: string;
  variables?: Variables;
  authMode?: GRAPHQL_AUTH_MODE;
};
async function appSyncQuery<
  Result extends object,
  Variables extends object = {}
>(
  options: GraphqlOptions<Variables>,
  additionalHeaders?: {
    [key: string]: string;
  },
): Promise<GraphqlResult<Result>> {
  const result = await API.graphql(options, additionalHeaders);

  return blindCast<
    GraphqlResult<Result>,
    "we require the caller to specify the return type of API.graphql(), which is typed as `object`"
  >(result);
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

async function createPlantWithEvents(newPlant: Plant): Promise<Plant[]> {
  const plantResult = await appSyncQuery<
    CreatePlantMutation,
    CreatePlantMutationVariables
  >({
    query: mutations.createPlant,
    variables: {
      input: omit(plantToGraphqlPlant(newPlant), ["id"]),
    },
  });

  assertGraphqlSuccessResult(plantResult);
  assertPresent(plantResult.data.createPlant);
  const plantId = plantResult.data.createPlant.id;

  // TODO: batch resolver https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-batch.html

  for (let event of newPlant.events) {
    const eventResult = await appSyncQuery<
      CreatePlantEventMutation,
      CreatePlantEventMutationVariables
    >({
      query: mutations.createPlantEvent,
      variables: {
        input: { ...event, plantId, createdAt: dateToString(event.createdAt) },
      },
    });

    assertGraphqlSuccessResult(eventResult);
  }

  return persistence.loadPlants();
}

const persistence = {
  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem, userIdKey: localStorageKeys.userId });
  },

  loadPlants: async (): Promise<Plant[]> => {
    let result: Plant[] = [];

    let latestResponse: GraphqlResult<ListPlantsQuery>;
    let items: QueryResultItems<ListPlantsQuery["listPlants"]>;
    let nextToken: string | null = null;

    async function fetchNextPage(cursor?: string | null) {
      latestResponse = await appSyncQuery<
        ListPlantsQuery,
        ListPlantsQueryVariables
      >(graphqlOperation(queries.listPlants, { nextToken: cursor }));

      assertGraphqlSuccessResult(latestResponse);
      assertPresent(latestResponse.data.listPlants);
      assertPresent(latestResponse.data.listPlants.items);

      items = latestResponse.data.listPlants.items || [];
      nextToken = latestResponse.data.listPlants.nextToken;
      result = [...result, ...filterNull(items).map(graphqlPlantToPlant)];
    }

    do {
      await fetchNextPage(nextToken);
    } while (nextToken);

    return result;
  },

  updatePlant: async (plant: Plant): Promise<Plant> => {
    const result = await appSyncQuery<
      UpdatePlantMutation,
      UpdatePlantMutationVariables
    >({
      query: mutations.updatePlant,
      variables: {
        input: plantToGraphqlPlant(plant),
      },
    });

    assertGraphqlSuccessResult(result);
    assertPresent(result.data.updatePlant);

    return graphqlPlantToPlant(result.data.updatePlant);
  },

  waterPlant: async (plant: Plant): Promise<Plant> => {
    // TODO: implement as custom resolver for named mutation
    const lastWateredAt = dateToString(new Date());

    const plantEventResult = await appSyncQuery<
      CreatePlantEventMutation,
      CreatePlantEventMutationVariables
    >({
      query: mutations.createPlantEvent,
      variables: {
        input: {
          plantId: plant.id,
          createdAt: lastWateredAt,
          type: PlantEventType.WATERED,
        },
      },
    });

    assertGraphqlSuccessResult(plantEventResult);

    const result = await appSyncQuery<
      UpdatePlantMutation,
      UpdatePlantMutationVariables
    >({
      query: mutations.updatePlant,
      variables: {
        input: {
          ...plantToGraphqlPlant(plant),
          lastWateredAt,
        },
      },
    });

    assertGraphqlSuccessResult(result);
    assertPresent(result.data.updatePlant);

    return graphqlPlantToPlant(result.data.updatePlant);
  },

  createPlant: async (
    newPlant: Omit<PlantInput, "userId">,
  ): Promise<Plant[]> => {
    let userId = await persistence.getUserId();

    await API.graphql(
      graphqlOperation(mutations.createPlant, {
        input: { ...newPlant, userId },
      }),
    );

    return persistence.loadPlants();
  },

  deletePlant: async (plant: Plant): Promise<void> => {
    const input: DeletePlantInput = {
      id: plant.id,
    };

    await API.graphql(graphqlOperation(mutations.deletePlant, { input }));
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
      await createPlantWithEvents(plant);
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
