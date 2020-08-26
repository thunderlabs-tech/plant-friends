import { Plant } from "./Plant";

export type DataExport = {
  nextMigrationIndex: number;
  plants: Plant[];
};

export default function exportData(data: DataExport) {
  return JSON.stringify(data);
}
