import exportData from "src/data/exportData";
import { Plant } from "src/data/Plant";
import { PlantEventType } from "src/gen/API";
import { makePlant, makePlantEvent } from "src/utilities/test/factories";

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
    const createdAtDate = new Date(2020, 1, 1, 0, 0, 0, 0);
    const timeOfDeathDate = new Date(2020, 3, 1, 0, 0, 0, 0);
    const lastWateredAtDate = new Date(2020, 4, 1, 0, 0, 0, 0);
    const lastFertilizedAtDate = new Date(2020, 4, 1, 0, 0, 0, 0);
    const waterNextAtDate = new Date(2020, 5, 1, 0, 0, 0, 0);
    const fertilizeNextAtDate = new Date(2020, 6, 1, 0, 0, 0, 0);

    const plants: Plant[] = [
      makePlant({
        events: [
          makePlantEvent({
            createdAt: lastWateredAtDate,
            type: PlantEventType.WATERED,
          }),
          makePlantEvent({
            createdAt: lastFertilizedAtDate,
            type: PlantEventType.FERTILIZED,
          }),
        ],
        timeOfDeath: timeOfDeathDate,
        lastWateredAt: lastWateredAtDate,
        lastFertilizedAt: lastFertilizedAtDate,
        createdAt: createdAtDate,
        waterNextAt: waterNextAtDate,
        fertilizeNextAt: fertilizeNextAtDate,
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
        events: [
          {
            ...plants[0].events[0],
            createdAt: lastWateredAtDate.toISOString(),
          },
          {
            ...plants[0].events[1],
            createdAt: lastFertilizedAtDate.toISOString(),
          },
        ],
        timeOfDeath: timeOfDeathDate.toISOString(),
        lastWateredAt: lastWateredAtDate.toISOString(),
        lastFertilizedAt: lastFertilizedAtDate.toISOString(),
        createdAt: createdAtDate.toISOString(),
        waterNextAt: waterNextAtDate.toISOString(),
        fertilizeNextAt: fertilizeNextAtDate.toISOString(),
      },
    ]);
  });
});
