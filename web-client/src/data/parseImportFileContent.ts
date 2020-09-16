import { DataExport } from "src/data/exportData";
import deserializeDateStrings from "src/utilities/deserializeDateStrings";

type Replace<Input, SearchFor, Replacement> = Input extends SearchFor
  ? Exclude<Input, SearchFor> | Replacement
  : Input;

type DateValuesAsStrings<TargetObject extends Record<string, unknown>> = {
  [Key in keyof TargetObject]: TargetObject[Key] extends Date
    ? string
    : TargetObject[Key] extends Record<string, unknown>
    ? DateValuesAsStrings<TargetObject[Key]>
    : Replace<TargetObject[Key], Date, string>;
};

export class InvalidImportFormatError extends Error {}

export default function parseImportFileContent(
  fileContent: string,
): DataExport {
  let result: DateValuesAsStrings<DataExport>;

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
