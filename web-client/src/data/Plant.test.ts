import { formatTimeUntilAction, nextActionDueDate } from "src/data/Plant";
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

  describe("formatTimeUntilAction", () => {
    const { now } = fixtures({
      now: () => new Date(2020, 1, 1, 12, 0, 0),
    });

    describe.only("when the next action is 1 day in the future", () => {
      const { nextActionDate } = fixtures({
        nextActionDate: () => new Date(2020, 1, 2),
      });

      it('returns "tomorrow"', () => {
        expect(formatTimeUntilAction(nextActionDate(), now())).toEqual(
          "tomorrow",
        );
      });
    });

    describe("when the next action is 0 days in the future", () => {
      const { nextActionDate } = fixtures({
        nextActionDate: () => new Date(2020, 1, 1),
      });

      it('returns "today"', () => {
        expect(formatTimeUntilAction(nextActionDate(), now())).toEqual("today");
      });
    });

    describe("when the next action is in the past", () => {
      const { nextActionDate } = fixtures({
        nextActionDate: () => new Date(2019, 1, 1),
      });

      it('returns "today"', () => {
        expect(formatTimeUntilAction(nextActionDate(), now())).toEqual("today");
      });
    });

    describe("when the next action is many days in the future", () => {
      const { nextActionDate } = fixtures({
        nextActionDate: () => new Date(2020, 1, 5),
      });

      it("returns the number of days in the future", () => {
        expect(formatTimeUntilAction(nextActionDate(), now())).toMatch(
          /in \d+ days/,
        );
      });
    });
  });
});
