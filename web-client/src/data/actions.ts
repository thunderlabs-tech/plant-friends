import { Collection } from "src/utilities/state/useCollection";
import persistence from "src/data/persistence";
import LoadingState from "src/utilities/state/LoadingState";
import { needsFertilizer, needsWater, Plant, PlantInput } from "src/data/Plant";
import { useHistory } from "react-router-dom";
import { plantListUrl } from "src/routes/PlantListRoute";
import { DataExport } from "src/data/exportData";
import { add, startOfDay } from "date-fns";

export async function waterPlant(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = await persistence.waterPlant(plant);
  plantDispatch.replace(plant, updatedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function fertilizePlant(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<void> {
  plantDispatch.setLoadingState(LoadingState.updating);

  const updatedPlant = await persistence.fertilizePlant(plant);
  plantDispatch.replace(plant, updatedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
}

export async function snoozeReminders(
  plant: Plant,
  plantDispatch: Collection<Plant>["dispatch"],
): Promise<Plant> {
  plantDispatch.setLoadingState(LoadingState.updating);

  let waterNextAt = plant.waterNextAt;
  let fertilizeNextAt = plant.fertilizeNextAt;

  const today = startOfDay(new Date());
  if (needsWater(plant)) {
    waterNextAt = add(today, { days: 1 });
  }
  if (needsFertilizer(plant)) {
    fertilizeNextAt = add(today, { days: 1 });
  }

  const updatedPlant = await persistence.updatePlant({
    ...plant,
    waterNextAt,
    fertilizeNextAt,
  });
  plantDispatch.replace(plant, updatedPlant);

  plantDispatch.setLoadingState(LoadingState.ready);
  return updatedPlant;
}

export async function createPlant(
  plant: PlantInput,
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
