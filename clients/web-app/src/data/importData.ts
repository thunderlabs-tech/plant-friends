import { Plant } from "./Plant";
import { DataExport } from "./exportData";
import { Override } from "../utilities/lang/Override";
import deserializeDateStrings from "../utilities/deserializeDateStrings";

type PlantWithStringDates = Override<
  Plant,
  { wateringTimes: string[]; timeOfDeath: string | undefined }
>;

export class InvalidImportFormatError extends Error {}

export default function importData(fileContent: string): DataExport {
  let result: Override<DataExport, { plants: PlantWithStringDates[] }>;
  try {
    result = JSON.parse(fileContent);
  } catch (error) {
    throw new InvalidImportFormatError("Import is not valid JSON");
  }

  if (
    typeof result !== "object" ||
    !result ||
    typeof result.nextMigrationIndex !== "number" ||
    !Array.isArray(result.plants)
  ) {
    throw new InvalidImportFormatError(
      "Import data does not contain a valid export object",
    );
  }

  return deserializeDateStrings(result);
}
