import localforage from 'localforage';
import { Plant } from '../data/Plant';

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

async function getNextId(): Promise<string> {
  const idCounter: number = (await getItem<number | undefined>('id-counter')) || 0;
  const nextId = idCounter + 1;
  setItem<number>('id-counter', nextId);
  return nextId.toString();
}

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  loadPlants: async (): Promise<Plant[]> => {
    return (await getItem<Plant[] | undefined>('plants')) || [];
  },

  storePlants: (plants: Plant[]): Promise<Plant[]> => {
    return setItem<Plant[]>('plants', plants);
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
};
export type Persistence = typeof persistence;

export default persistence;
