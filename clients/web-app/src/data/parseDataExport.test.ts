import { DataExport } from "./exportData";
import parseDataExport, { InvalidDataExportString } from "./parseDataExport";
import castAs from "../utilities/lang/castAs";
import { Override } from "../utilities/lang/Override";

describe("parseDataExport()", () => {
  it("parses the input string as JSON", () => {
    const dataExport: DataExport = {
      idCounter: 1,
      nextMigrationIndex: 2,
      plants: [],
    };
    const jsonString = JSON.stringify(dataExport);
    const parsedResult = parseDataExport(jsonString);
    expect(parsedResult).toEqual(dataExport);
  });

  it("parses ISO8601 date strings as Date objects", () => {
    const dataExport: DataExport = {
      idCounter: 1,
      nextMigrationIndex: 2,
      plants: [
        {
          id: "1",
          name: "Plant 1",
          wateringPeriodInDays: 10,
          wateringTimes: [new Date(2020, 1, 1, 0, 0, 0, 0)],
        },
      ],
    };
    const jsonString = JSON.stringify(dataExport);
    const parsedResult = parseDataExport(jsonString);
    expect(parsedResult).toEqual(dataExport);
  });

  it("throws an error if the string is not valid JSON", () => {
    const jsonString = "not valid JSON";

    expect(() => {
      parseDataExport(jsonString);
    }).toThrowError(/not valid JSON/);
  });

  it("throws an error if the encoded value is not an object", () => {
    const jsonString = "null";

    expect(() => {
      parseDataExport(jsonString);
    }).toThrowError(/does not contain a valid export object/);
  });

  it("throws an error if idCounter is not a number", () => {
    const jsonString = JSON.stringify(
      castAs<Override<DataExport, { idCounter: string }>>({
        idCounter: "not a number",
        nextMigrationIndex: 2,
        plants: [],
      }),
    );

    expect(() => {
      parseDataExport(jsonString);
    }).toThrowError(InvalidDataExportString);
  });
});
