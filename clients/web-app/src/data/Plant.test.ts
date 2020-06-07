import { Plant, lastWateredAt, waterNextAt, needsWater } from "./Plant";
import { makePlant } from "../utilities/test/factories";
import add from "date-fns/add";
import sub from "date-fns/sub";

describe("Plant", () => {
  describe("lastWateredAt()", () => {
    describe("when there are no wateringTimes", () => {
      it("is undefined", () => {
        const plant: Plant = makePlant({ wateringTimes: [] });
        expect(lastWateredAt(plant)).toBe(undefined);
      });
    });

    describe("when there are multiple wateringTimes", () => {
      it("is returns the latest one", () => {
        const earliestWateringTime = new Date(2020, 1, 1);
        const latestWateringTime = new Date(2020, 1, 2);
        const plant: Plant = makePlant({
          wateringTimes: [earliestWateringTime, latestWateringTime],
        });
        expect(lastWateredAt(plant)).toBe(latestWateringTime);
      });
    });
  });

  describe("waterNextAt()", () => {
    describe("when there are no wateringTimes", () => {
      it("is undefined", () => {
        const plant: Plant = makePlant({ wateringTimes: [] });
        expect(waterNextAt(plant)).toBe(undefined);
      });
    });

    describe("when there are multiple wateringTimes", () => {
      it("returns midnight `wateringPeriod` days after the last time it was watered", () => {
        const latestWateringTime = new Date(2020, 1, 2, 16, 55);
        const wateringPeriodInDays = 4;
        const nextWaterDate = new Date(2020, 1, 6, 0, 0);

        const plant: Plant = makePlant({
          wateringTimes: [new Date(2020, 1, 1), latestWateringTime],
          wateringPeriodInDays,
        });

        expect(waterNextAt(plant)).toEqual(nextWaterDate);
      });
    });
  });

  describe("needsWater()", () => {
    describe("when there are no wateringTimes", () => {
      it("is undefined", () => {
        const plant: Plant = makePlant({ wateringTimes: [] });
        expect(needsWater(plant)).toBe(true);
      });
    });

    describe("when there are multiple wateringTimes", () => {
      const latestWateringTime = new Date(2020, 1, 2, 16, 55);
      const wateringPeriodInDays = 4;
      const nextWaterDate = new Date(2020, 1, 6, 0, 0);

      describe("when the next watering date is now or in the past", () => {
        it("is true", () => {
          const plant: Plant = makePlant({
            wateringTimes: [new Date(2020, 1, 1), latestWateringTime],
            wateringPeriodInDays,
          });
          const now = add(nextWaterDate.valueOf(), { days: 5 }).valueOf();
          expect(needsWater(plant, now)).toBe(true);
        });
      });

      describe("when the next watering date is in the future", () => {
        it("is true", () => {
          const plant: Plant = makePlant({
            wateringTimes: [new Date(2020, 1, 1), latestWateringTime],
            wateringPeriodInDays,
          });
          const now = sub(nextWaterDate.valueOf(), { days: 5 }).valueOf();
          expect(needsWater(plant, now)).toBe(false);
        });
      });
    });
  });
});
