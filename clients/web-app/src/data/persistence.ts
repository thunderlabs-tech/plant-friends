import localforage from 'localforage';
import { Plant } from './Plant';
import { runMigrations } from './migrations';

localforage.config({
  name: 'plant-friends',
  version: 1.1,
});

const namespace = process.env.NODE_ENV;

function storageKey(key: string): string {
  return `${namespace}-${key}`;
}

export type getItem = <T>(key: string, callback?: (err: any, value: T) => void) => Promise<T>;
function getItem<T>(key: string, callback?: (err: any, value: T) => void): Promise<T> {
  return localforage.getItem<T>(storageKey(key), callback);
}

export type setItem = <T>(key: string, value: T, callback?: (err: any, value: T) => void) => Promise<T>;
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

const ID_COUNTER_KEY = 'id-counter';
const PLANTS_KEY = 'plants';

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  runMigrations: async (): Promise<void> => {
    await runMigrations({ getItem, setItem, PLANTS_KEY, ID_COUNTER_KEY });
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
  removePlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();

    const newPlants = allPlants.filter((element) => element.id !== plant.id);

    return persistence.storePlants(newPlants);
  },

  addPlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();

    const newPlants = [...allPlants, plant];

    return persistence.storePlants(newPlants);
  },

  createPlant: async (plantDescriptor: Omit<Plant, 'id'>): Promise<Plant[]> => {
    const newPlant = { ...plantDescriptor, id: await getNextId() };
    return persistence.addPlant(newPlant);
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
