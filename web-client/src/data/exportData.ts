import { Plant } from "src/data/Plant";

export type DataExport = {
  nextMigrationIndex: number;
  plants: Plant[];
};

export default function exportData(data: DataExport): string {
  return JSON.stringify(data);
}
