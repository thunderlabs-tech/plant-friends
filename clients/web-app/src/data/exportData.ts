import { Plant } from "./Plant";

export type DataExport = {
  idCounter: number;
  nextMigrationIndex: number;
  plants: Plant[];
};

export default function exportData(data: DataExport) {
  // const headerRow = [
  //   "id",
  //   "name",
  //   "wateringPeriodInDays",
  //   "wateringTimes",
  //   "timeOfDeath",
  // ];
  // const bodyRows = plants.map((plant) => [
  //   plant.id,
  //   plant.name,
  //   plant.wateringPeriodInDays,
  //   `"${plant.wateringTimes.map((date) => date.toISOString()).join(";")}"`,
  //   plant.timeOfDeath ? plant.timeOfDeath.toISOString() : "",
  // ]);
  // const content = [headerRow, ...bodyRows].join("\n");

  // return new Blob([content], { type: "text/csv;charset=utf-8" });

  return JSON.stringify(data);
}
