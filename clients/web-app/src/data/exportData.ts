import { Plant } from "./Plant";

export type ExportPlant = Omit<Plant, "_id">;
export type DataExport = {
  idCounter: number;
  nextMigrationIndex: number;
  plants: ExportPlant[];
};

export default function exportData(data: DataExport) {
  return JSON.stringify(data);
}
