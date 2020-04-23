import { Collection } from '../utilities/state/useCollection';
import persistence from './persistence';
import LoadingState from '../utilities/state/LoadingState';
import { Plant } from './Plant';
import { useHistory } from 'react-router-dom';
import { plantListRoute } from '../init/routes';

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
  plantDispatch.setLoadingState(LoadingState.updating);
  plantDispatch.setData(await persistence.loadPlants());
  plantDispatch.setLoadingState(LoadingState.ready);
}
