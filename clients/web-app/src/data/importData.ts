import { Plant } from "./Plant";
import { DataExport } from "./exportData";
import { Override } from "../utilities/lang/Override";

type PlantWithStringDates = Override<Plant, { wateringTimes: string[] }>;

class InvalidImportFormatError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default function parseDataExport(fileContent: string): DataExport {
  let result: Override<DataExport, { plants: PlantWithStringDates[] }>;
  try {
    result = JSON.parse(fileContent);
  } catch (error) {
    throw new InvalidImportFormatError("Import is not valid JSON");
  }

  if (
    typeof result !== "object" ||
    !result ||
    typeof result.idCounter !== "number" ||
    typeof result.nextMigrationIndex !== "number" ||
    !Array.isArray(result.plants)
  ) {
    throw new InvalidImportFormatError(
      "Import data does not contain a valid export object",
    );
  }

  const plants = result.plants.map(
    (plantWithStringDates: PlantWithStringDates): Plant => {
      return {
        ...plantWithStringDates,
        wateringTimes: plantWithStringDates.wateringTimes.map(
          (isoDateString) => new Date(Date.parse(isoDateString)),
        ),
      };
    },
  );

  return {
    ...result,
    plants,
  };
}
