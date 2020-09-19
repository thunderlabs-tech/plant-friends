import localforage from "localforage";
import { Plant, PlantInput } from "src/data/Plant";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

import { runMigrations } from "src/data/migrations";
import { DataExport } from "src/data/exportData";
import { omit, pick } from "lodash";
import * as queries from "src/gen/graphql/queries";
import * as mutations from "src/gen/graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import blindCast from "src/utilities/lang/blindCast";
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
  ListPlantEventsQuery,
  ListPlantEventsQueryVariables,
} from "src/gen/API";
import {
  GraphqlResult,
  assertGraphqlSuccessResult,
} from "src/utilities/graphql/GraphqlResult";
import { excludeValue } from "src/utilities/excludeValue";
import graphqlPlantToPlant from "src/utilities/graphql/graphqlPlantToPlant";
import assertPresent from "src/utilities/lang/assertPresent";
import { QueryResultItems } from "src/utilities/graphql/QueryTypes";
import plantToGraphqlPlant from "src/utilities/graphql/plantToGraphqlPlant";
import dateToString from "src/utilities/graphql/dateToString";
import PlantEvent from "src/data/PlantEvent";
import { parseDateString } from "src/utilities/graphql/parseDateString";

type GraphqlOptions<Variables extends Record<string, unknown>> = {
  query: string;
  variables?: Variables;
  authMode?: GRAPHQL_AUTH_MODE;
};
async function appSyncQuery<
  Result extends Record<string, unknown>,
  Variables extends Record<string, unknown> = Record<string, unknown>
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
});

export async function getNextMigrationIndex(): Promise<number> {
  return (await getItem<number>(localStorageKeys.nextMigrationIndex)) || 0;
}

export async function setNextMigrationIndex(value: number): Promise<void> {
  await setItem<number>(localStorageKeys.nextMigrationIndex, value);
}

export class IncompatibleImportError extends Error {}

async function createPlantWithEvents(newPlant: Plant): Promise<void> {
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

  for (const event of newPlant.events) {
    const eventResult = await appSyncQuery<
      CreatePlantEventMutation,
      CreatePlantEventMutationVariables
    >({
      query: mutations.createPlantEvent,
      variables: {
        input: {
          ...omit(event, "id"),
          plantId,
          createdAt: dateToString(event.createdAt),
        },
      },
    });

    assertGraphqlSuccessResult(eventResult);
  }
}

function assignPlantEventsToPlants(
  plants: Plant[],
  plantEvents: PlantEvent[],
): Plant[] {
  const idToPlantDict: { [key: string]: Plant | undefined } = {};
  plants.forEach((plant) => {
    idToPlantDict[plant.id] = plant;
    plant.events = [];
  });
  plantEvents.forEach((event) => {
    const plant = idToPlantDict[event.plantId];
    if (!plant) return;
    plant.events.push(event);
  });
  return excludeValue(Object.values(idToPlantDict), undefined);
}

const persistence = {
  runMigrations: async (): Promise<void> => {
    await runMigrations({ setItem });
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
      result = [
        ...result,
        ...excludeValue(items, null).map(graphqlPlantToPlant),
      ];
    }

    do {
      await fetchNextPage(nextToken);
    } while (nextToken);

    return result;
  },

  loadPlantsAndEvents: async (): Promise<Plant[]> => {
    const [plants, plantEvents] = await Promise.all([
      persistence.loadPlants(),
      persistence.loadPlantEvents(),
    ]);

    assignPlantEventsToPlants(plants, plantEvents);

    return plants;
  },

  loadPlantEvents: async (): Promise<PlantEvent[]> => {
    let result: PlantEvent[] = [];

    let latestResponse: GraphqlResult<ListPlantEventsQuery>;
    let items: QueryResultItems<ListPlantEventsQuery["listPlantEvents"]>;
    let nextToken: string | null = null;

    async function fetchNextPage(cursor?: string | null) {
      latestResponse = await appSyncQuery<
        ListPlantEventsQuery,
        ListPlantEventsQueryVariables
      >(graphqlOperation(queries.listPlantEvents, { nextToken: cursor }));

      assertGraphqlSuccessResult(latestResponse);
      assertPresent(latestResponse.data.listPlantEvents);
      assertPresent(latestResponse.data.listPlantEvents.items);

      items = latestResponse.data.listPlantEvents.items || [];
      nextToken = latestResponse.data.listPlantEvents.nextToken;
      result = [
        ...result,
        ...excludeValue(items, null).map((item) => {
          return {
            ...pick(item, ["id", "plantId", "type", "createdAt"]),
            createdAt: parseDateString(item.createdAt),
          };
        }),
      ];
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

    return {
      ...graphqlPlantToPlant(result.data.updatePlant),
      events: plant.events, // TODO: don't copy events array
    };
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
    assertPresent(plantEventResult.data.createPlantEvent);
    const plantEvent = plantEventResult.data.createPlantEvent;

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

    return {
      ...graphqlPlantToPlant(result.data.updatePlant),
      events: [
        // TODO: don't copy events array
        ...plant.events,
        {
          ...plantEvent,
          createdAt: parseDateString(plantEvent.createdAt),
        },
      ],
    };
  },

  createPlant: async (newPlant: PlantInput): Promise<Plant[]> => {
    await API.graphql(
      graphqlOperation(mutations.createPlant, {
        input: newPlant,
      }),
    );

    return persistence.loadPlantsAndEvents();
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

    await Promise.all([removeItem(localStorageKeys.nextMigrationIndex)]);

    window.location.reload();
  },

  getDataForExport: async (): Promise<DataExport> => {
    const [nextMigrationIndex, plants] = await Promise.all([
      getNextMigrationIndex(),
      persistence.loadPlantsAndEvents(),
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

    return persistence.loadPlantsAndEvents();
  },
};
export type Persistence = typeof persistence;

export default persistence;
