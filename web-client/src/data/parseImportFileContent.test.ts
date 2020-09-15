import { DataExport } from "src/data/exportData";
import parseImportFileContent from "src/data/parseImportFileContent";
import { makePlant, makeWateredEvent } from "src/utilities/test/factories";

describe("importData()", () => {
  it("parses the input string as JSON", () => {
    const dataExport: DataExport = {
      nextMigrationIndex: 2,
      plants: [],
    };
    const jsonString = JSON.stringify(dataExport);
    const parsedResult = parseImportFileContent(jsonString);
    expect(parsedResult).toEqual(dataExport);
  });

  it("parses ISO8601 date strings as Date objects", () => {
    const dataExport: DataExport = {
      nextMigrationIndex: 2,
      plants: [
        makePlant({
          events: [
            makeWateredEvent({ createdAt: new Date(2020, 1, 1, 0, 0, 0, 0) }),
          ],
        }),
      ],
    };
    const jsonString = JSON.stringify(dataExport);
    const parsedResult = parseImportFileContent(jsonString);
    expect(parsedResult).toEqual(dataExport);
  });

  it("throws an error if the string is not valid JSON", () => {
    const jsonString = "not valid JSON";

    expect(() => {
      parseImportFileContent(jsonString);
    }).toThrowError(/not valid JSON/);
  });

  it("throws an error if the encoded value is not an object", () => {
    const jsonString = "null";

    expect(() => {
      parseImportFileContent(jsonString);
    }).toThrowError(/does not contain a valid export object/);
  });
});
