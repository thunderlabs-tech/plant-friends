import { Plant, waterNextAt, needsWater } from "./Plant";
import { makePlant } from "../utilities/test/factories";
import add from "date-fns/add";
import sub from "date-fns/sub";
import fixtures from "../utilities/test/fixtures";

describe("Plant", () => {
  describe("waterNextAt()", () => {
    describe("when `lastWateredAt` is not set", () => {
      it("is undefined", () => {
        const plant: Plant = makePlant({ lastWateredAt: null });
        expect(waterNextAt(plant)).toBe(undefined);
      });
    });

    describe("when `lastWateredAt` is set", () => {
      it("returns midnight `wateringPeriod` days after the last time it was watered", () => {
        const lastWateredAt = new Date(2020, 1, 2, 16, 55);
        const wateringPeriodInDays = 4;
        const nextWaterDate = new Date(2020, 1, 6, 0, 0);

        const plant: Plant = makePlant({ lastWateredAt, wateringPeriodInDays });

        expect(waterNextAt(plant)).toEqual(nextWaterDate);
      });
    });
  });

  describe("needsWater()", () => {
    describe("when `lastWateredAt` is not set", () => {
      it("is undefined", () => {
        const plant: Plant = makePlant({ lastWateredAt: null });
        expect(needsWater(plant)).toBe(true);
      });
    });

    describe("when `lastWateredAt` is set", () => {
      const { lastWateredAt, wateringPeriodInDays, nextWaterDate } = fixtures({
        lastWateredAt: () => new Date(2020, 1, 2, 16, 55),
        wateringPeriodInDays: () => 4,
        nextWaterDate: () => new Date(2020, 1, 6, 0, 0),
      });

      const { plant } = fixtures({
        plant: () =>
          makePlant({
            lastWateredAt: lastWateredAt(),
            wateringPeriodInDays: wateringPeriodInDays(),
          }),
      });

      describe("when the next watering date is now or in the past", () => {
        it("is true", () => {
          const now = add(nextWaterDate(), { days: 5 }).valueOf();
          expect(needsWater(plant(), now)).toBe(true);
        });
      });

      describe("when the next watering date is in the future", () => {
        it("is false", () => {
          const now = sub(nextWaterDate(), { days: 5 }).valueOf();
          expect(needsWater(plant(), now)).toBe(false);
        });
      });
    });
  });
});
