import { nextActionDueDate } from "src/data/Plant";
import fixtures from "src/utilities/test/fixtures";

describe("Plant", () => {
  describe("nextActionDueDate", () => {
    const { plantCreatedAt } = fixtures({
      plantCreatedAt: () => new Date(2020, 1, 1, 16, 55),
    });

    describe("when the action period is not set", () => {
      it("is undefined", () => {
        expect(
          nextActionDueDate({
            periodInDays: null,
            lastPerformedAt: null,
            plantCreatedAt: plantCreatedAt(),
          }),
        ).toBeUndefined();
      });
    });

    describe("when the action period is set", () => {
      const { periodInDays } = fixtures({
        periodInDays: () => 4,
      });

      describe("but it has not been performed before", () => {
        it("is measured from the plant creation date", () => {
          expect(
            nextActionDueDate({
              periodInDays: periodInDays(),
              lastPerformedAt: null,
              plantCreatedAt: plantCreatedAt(),
            }),
          ).toEqual(new Date(2020, 1, 5, 0, 0));
        });
      });

      describe("and it has been performed before", () => {
        const { lastPerformedAt } = fixtures({
          lastPerformedAt: () => new Date(2020, 1, 10, 8, 33),
        });

        it("is measured from the last time the action was performed", () => {
          expect(
            nextActionDueDate({
              periodInDays: periodInDays(),
              lastPerformedAt: lastPerformedAt(),
              plantCreatedAt: plantCreatedAt(),
            }),
          ).toEqual(new Date(2020, 1, 14, 0, 0));
        });
      });
    });
  });
});
