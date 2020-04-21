import { Collection } from '../state/useCollection';
import persistence from '../state/persistence';
import LoadingState from '../state/LoadingState';
import { Plant } from '../data/Plant';
import { useHistory } from 'react-router-dom';
import { plantListRoute } from './routes';

export async function waterPlant(plant: Plant, plantDispatch: Collection<Plant>['dispatch']): Promise<void> {
  const updatedPlant = { ...plant, wateringTimes: [new Date(), ...plant.wateringTimes] };

  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.updatePlant(updatedPlant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function createPlant(
  plant: Omit<Plant, 'id'>,
  plantDispatch: Collection<Plant>['dispatch']
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.createPlant(plant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function updatePlant(
  plant: Plant,
  plantDispatch: Collection<Plant>['dispatch'],
  history: ReturnType<typeof useHistory>
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.updatePlant(plant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
  history.push(plantListRoute());
}

export async function refreshPlants(plantDispatch: Collection<Plant>['dispatch']): Promise<void> {
  plantDispatch.setData(await persistence.loadPlants());
  plantDispatch.setLoadingState(LoadingState.ready);
}
