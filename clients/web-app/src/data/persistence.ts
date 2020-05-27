import localforage from 'localforage';
import { Plant } from './Plant';

localforage.config({
  name: 'plant-friends',
  version: 1.1,
});

const namespace = process.env.NODE_ENV;

function storageKey(key: string): string {
  return `${namespace}-${key}`;
}

function getItem<T>(key: string, callback?: (err: any, value: T) => void): Promise<T> {
  return localforage.getItem<T>(storageKey(key), callback);
}

function setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T> {
  return localforage.setItem<T>(storageKey(key), value, callback);
}

async function getIdCounter(): Promise<number> {
  return (await getItem<number | undefined>('id-counter')) || 0;
}

async function setIdCounter(nextId: number): Promise<number> {
  return setItem<number>('id-counter', nextId);
}

async function getNextId(): Promise<string> {
  const idCounter: number = await getIdCounter();

  const nextId = idCounter + 1;
  setIdCounter(nextId);
  return nextId.toString();
}

const NEXT_MIGRATION_INDEX_KEY = 'next-migration-index';
const ID_COUNTER_KEY = 'id-counter';
const PLANTS_KEY = 'plants';

const migrations = Object.freeze([
  async function initialStructure() {
    await setItem(PLANTS_KEY, []);
    await setItem(ID_COUNTER_KEY, 0);
  },
]);

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    const plantsExist = (await getItem<Plant[] | undefined>(PLANTS_KEY)) !== undefined;
    const nextMigrationIndex = (await getItem<number | undefined>(NEXT_MIGRATION_INDEX_KEY)) || plantsExist ? 1 : 0;

    if (nextMigrationIndex > migrations.length) return;

    for (let i = nextMigrationIndex; i < migrations.length; i++) {
      const nextMigration = migrations[i];
      await nextMigration();
    }

    setItem(NEXT_MIGRATION_INDEX_KEY, migrations.length);
  },

  loadPlants: async (): Promise<Plant[]> => {
    return await getItem<Plant[]>(PLANTS_KEY);
  },

  storePlants: (plants: Plant[]): Promise<Plant[]> => {
    return setItem<Plant[]>(PLANTS_KEY, plants);
  },

  updatePlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();
    const plantIndex = allPlants.findIndex((element) => element.id === plant.id);

    if (plantIndex === -1) throw new Error(`Plant with ID ${plant.id} not found`);

    const newPlants = [...allPlants.slice(0, plantIndex), plant, ...allPlants.slice(plantIndex + 1)];

    return persistence.storePlants(newPlants);
  },

  createPlant: async (plantDescriptor: Omit<Plant, 'id'>): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();

    const newPlant = { ...plantDescriptor, id: await getNextId() };
    const newPlants = [...allPlants, newPlant];

    return persistence.storePlants(newPlants);
  },

  batchCreatePlants: async (plantDescriptors: Omit<Plant, 'id'>[]): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();
    let idCounter = await getIdCounter();

    const newPlants: Plant[] = plantDescriptors.map((plantDescriptor) => {
      idCounter += 1;
      return { ...plantDescriptor, id: idCounter.toString() };
    });

    await setIdCounter(idCounter);

    return persistence.storePlants([...allPlants, ...newPlants]);
  },
};
export type Persistence = typeof persistence;

export default persistence;
