import { Collection } from '../state/useCollection';
import persistence from '../state/persistence';
import LoadingState from '../state/LoadingState';
import { Plant } from '../data/Plant';

export async function waterPlant(plant: Plant, plantDispatch: Collection<Plant>['dispatch']): Promise<void> {
  const updatedPlant = { ...plant, wateringTimes: [new Date(), ...plant.wateringTimes] };

  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.updatePlant(updatedPlant);

  plantDispatch.setData(newPlants);
  plantDispatch.setLoadingState(LoadingState.ready);
}
