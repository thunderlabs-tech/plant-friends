import exportData from "./exportData";
import { Plant } from "./Plant";
import { makePlant, makeWateredEvent } from "../utilities/test/factories";

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
    const timeOfDeathDate = new Date(2020, 2, 1, 0, 0, 0, 0);
    const lastWateredAtDate = new Date(2020, 3, 1, 0, 0, 0, 0);

    const plants: Plant[] = [
      makePlant({
        events: { data: [makeWateredEvent({ createdAt: wateringTimeDate })] },
        timeOfDeath: timeOfDeathDate,
        lastWateredAt: lastWateredAtDate,
      }),
    ];

    const resultText = exportData({
      nextMigrationIndex: 1,
      plants,
    });
    const data = JSON.parse(resultText);

    expect(data.plants).toEqual([
      {
        ...plants[0],
        events: {
          data: [
            {
              ...plants[0].events.data[0],
              createdAt: wateringTimeDate.toISOString(),
            },
          ],
        },
        timeOfDeath: timeOfDeathDate.toISOString(),
        lastWateredAt: lastWateredAtDate.toISOString(),
      },
    ]);
  });
});
