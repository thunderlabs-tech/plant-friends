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

const persistence = {
  // NOTE: we don't verify the structure of stored data, we assume it was stored correctly

  loadPlants: (): Promise<Plant[]> => {
    return getItem<Plant[]>('plants');
  },

  storePlants: (plants: Plant[]): Promise<Plant[]> => {
    return setItem<Plant[]>('plants', plants);
  },

  updatePlant: async (plant: Plant): Promise<Plant[]> => {
    const allPlants = await persistence.loadPlants();
    const existingPlant = allPlants.findIndex((element) => element.id === plant.id);

    if (!existingPlant) throw new Error(`Plant with ID ${plant.id} not found`);

    const newPlants = [...allPlants.slice(0, existingPlant), plant, ...allPlants.slice(existingPlant + 1)];

    return persistence.storePlants(newPlants);
  },
};
export type Persistence = typeof persistence;

export default persistence;
