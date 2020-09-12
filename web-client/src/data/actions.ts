import { Collection } from "../utilities/state/useCollection";
import persistence from "./persistence";
import LoadingState from "../utilities/state/LoadingState";
import { Plant, PlantInput } from "./Plant";
import { useHistory } from "react-router-dom";
import { plantListUrl } from "../routes/PlantListRoute";
import { DataExport } from "./exportData";

export async function waterPlant(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = await persistence.waterPlant(plant);
  plantDispatch.replace(plant, updatedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function createPlant(
  plant: Omit<PlantInput, "userId">,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.createPlant(plant);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function updatePlant(
  originalPlant: Plant,
  updatedPlant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
  history: ReturnType<typeof useHistory>,
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  plantDispatch.replace(originalPlant, updatedPlant);
  const persistedPlant = await persistence.updatePlant(updatedPlant);
  plantDispatch.replace(updatedPlant, persistedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
  history.push(plantListUrl());
}

export async function refreshPlants(
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);
  plantDispatch.setData(await persistence.loadPlantsAndEvents());
  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function persistImportedData(
  importedData: DataExport,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<Plant[]> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const newPlants = await persistence.persistImportedData(importedData);
  plantDispatch.setData(newPlants);

  plantDispatch.setLoadingState(LoadingState.ready);

  return newPlants;
}

export async function moveToGraveyard(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = await persistence.updatePlant({
    ...plant,
    timeOfDeath: new Date(),
  });
  plantDispatch.replace(plant, updatedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function restoreFromGraveyard(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = await persistence.updatePlant({
    ...plant,
    timeOfDeath: null,
  });
  plantDispatch.replace(plant, updatedPlant);

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
