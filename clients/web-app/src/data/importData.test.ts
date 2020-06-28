import { DataExport } from "./exportData";
import importData from "./importData";

describe("importData()", () => {
  it("parses the input string as JSON", () => {
    const dataExport: DataExport = {
      idCounter: 1,
      nextMigrationIndex: 2,
      plants: [],
    };
    const jsonString = JSON.stringify(dataExport);
    const parsedResult = importData(jsonString);
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
    const parsedResult = importData(jsonString);
    expect(parsedResult).toEqual(dataExport);
  });

  it("throws an error if the string is not valid JSON", () => {
    const jsonString = "not valid JSON";

    expect(() => {
      importData(jsonString);
    }).toThrowError(/not valid JSON/);
  });

  it("throws an error if the encoded value is not an object", () => {
    const jsonString = "null";

    expect(() => {
      importData(jsonString);
    }).toThrowError(/does not contain a valid export object/);
  });
});
