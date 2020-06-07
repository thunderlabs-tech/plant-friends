import { Collection } from "../utilities/state/useCollection";
import persistence from "./persistence";
import LoadingState from "../utilities/state/LoadingState";
import { Plant } from "./Plant";
import { useHistory } from "react-router-dom";
import { plantListUrl } from "../routes/PlantListRoute";

export async function waterPlant(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  const updatedPlant = {
    ...plant,
    wateringTimes: [new Date(), ...plant.wateringTimes],
  };

  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.updatePlant(updatedPlant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function createPlant(
  plant: Omit<Plant, "id">,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.createPlant(plant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function updatePlant(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
  history: ReturnType<typeof useHistory>,
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.updatePlant(plant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
  history.push(plantListUrl());
}

export async function refreshPlants(
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);
  plantDispatch.setData(await persistence.loadPlants());
  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function batchCreatePlants(
  plants: Omit<Plant, "id">[],
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<Plant[]> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.batchCreatePlants(plants);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);

  return newPlants;
}

export async function moveToGraveyard(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = { ...plant, timeOfDeath: new Date() };
  const newPlants = await persistence.updatePlant(updatedPlant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function restoreFromGraveyard(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = { ...plant, timeOfDeath: undefined };
  const newPlants = await persistence.updatePlant(updatedPlant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function deleteAllData(
  plantDispatch: Collection<Plant>["dispatch"],
  history: ReturnType<typeof useHistory>,
): Promise<void> {
  await persistence.deleteAll();
  plantDispatch.setData([]);
  history.push("/");
}
