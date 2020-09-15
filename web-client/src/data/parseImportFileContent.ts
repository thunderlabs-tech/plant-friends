import { DataExport } from "src/data/exportData";
import deserializeDateStrings from "src/utilities/deserializeDateStrings";

type Replace<Input, SearchFor, Replacement> = Input extends SearchFor
  ? Exclude<Input, SearchFor> | Replacement
  : Input;

type DateValuesAsStrings<Object extends { [Key: string]: any }> = {
  [Key in keyof Object]: Object[Key] extends Date
    ? string
    : Object[Key] extends { [Key: string]: any }
    ? DateValuesAsStrings<Object[Key]>
    : Replace<Object[Key], Date, string>;
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
