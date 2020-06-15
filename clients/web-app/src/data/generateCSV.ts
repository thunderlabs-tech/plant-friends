import { Plant } from "./Plant";

export default function generateCSV(plants: Plant[]) {
  const headerRow = [
    "id",
    "name",
    "wateringPeriodInDays",
    "wateringTimes",
    "timeOfDeath",
  ];
  const bodyRows = plants.map((plant) => [
    plant.id,
    plant.name,
    plant.wateringPeriodInDays,
    `"${plant.wateringTimes.map((date) => date.toISOString()).join(";")}"`,
    plant.timeOfDeath ? plant.timeOfDeath.toISOString() : "",
  ]);
  const content = [headerRow, ...bodyRows].join("\n");

  return new Blob([content], { type: "text/csv;charset=utf-8" });
}
