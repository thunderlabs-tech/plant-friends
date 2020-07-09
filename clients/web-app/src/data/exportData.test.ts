import exportData from "./exportData";
import { Plant } from "./Plant";

describe("exportData()", () => {
  it("encodes the application data as JSON", () => {
    const idCounter = 1;
    const nextMigrationIndex = 2;

    const result = JSON.parse(
      exportData({
        nextMigrationIndex,
        idCounter,
        plants: [],
      }),
    );

    expect(result).toEqual({
      nextMigrationIndex,
      idCounter,
      plants: [],
    });
  });

  it("encodes dates as ISO8601 date strings", () => {
    const plants: Plant[] = [
      {
        _id: "1",
        name: "Plant 1",
        wateringPeriodInDays: 10,
        wateringTimes: [new Date(2020, 1, 1, 0, 0, 0, 0)],
        timeOfDeath: null,
        userId: 'aaaaaaaaa-bbbbbbbbb-ccccccccc',
      },
    ];

    const resultText = exportData({
      nextMigrationIndex: 1,
      idCounter: 2,
      plants,
    });
    const data = JSON.parse(resultText);

    const iso8601DateString = new Date(2020, 1, 1, 0, 0, 0, 0).toISOString();
    expect(data.plants).toEqual([
      {
        id: "1",
        name: "Plant 1",
        wateringPeriodInDays: 10,
        wateringTimes: [iso8601DateString],
      },
    ]);
  });
});
