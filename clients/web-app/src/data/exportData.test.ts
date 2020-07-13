import exportData from "./exportData";
import { Plant } from "./Plant";

describe("exportData()", () => {
  it("encodes the application data as JSON", () => {
    const nextMigrationIndex = 2;

    const result = JSON.parse(
      exportData({
        nextMigrationIndex,
        plants: [],
      }),
    );

    expect(result).toEqual({
      nextMigrationIndex,
      plants: [],
    });
  });

  it("encodes dates as ISO8601 date strings", () => {
    const wateringTimeDate = new Date(2020, 1, 1, 0, 0, 0, 0);
    const timeOfDeathDate = new Date(2020, 1, 1, 0, 0, 0, 0);

    const plants: Plant[] = [
      {
        _id: "1",
        name: "Plant 1",
        wateringPeriodInDays: 10,
        wateringTimes: [wateringTimeDate],
        timeOfDeath: timeOfDeathDate,
        userId: "aaaaaaaaa-bbbbbbbbb-ccccccccc",
        events: [],
      },
    ];

    const resultText = exportData({
      nextMigrationIndex: 1,
      plants,
    });
    const data = JSON.parse(resultText);

    const iso8601WateringTimeString = wateringTimeDate.toISOString();
    const iso8601TimeOfDeathString = timeOfDeathDate.toISOString();
    expect(data.plants).toEqual([
      {
        ...plants[0],
        wateringTimes: [iso8601WateringTimeString],
        timeOfDeath: iso8601TimeOfDeathString,
      },
    ]);
  });
});
