import { minDate } from "./minDate";

describe("minDate()", () => {
  describe("date1 = undefined, date2 = undefined", () => {
    it("returns undefined", () => {
      const date1 = undefined;
      const date2 = undefined;
      expect(minDate(date1, date2)).toEqual(undefined);
    });
  });

  describe("date1 = undefined, date2 = date", () => {
    it("returns date2", () => {
      const date1 = undefined;
      const date2 = new Date();
      expect(minDate(date1, date2)).toEqual(date2);
    });
  });

  describe("date1 = date, date2 = undefined", () => {
    it("returns date1", () => {
      const date1 = new Date();
      const date2 = undefined;
      expect(minDate(date1, date2)).toEqual(date1);
    });
  });

  describe("date1 is smaller", () => {
    it("returns date1", () => {
      const date1 = new Date(2020, 1, 2);
      const date2 = new Date(2020, 1, 3);
      expect(minDate(date1, date2)).toEqual(date1);
    });
  });

  describe("date2 is smaller", () => {
    it("returns date2", () => {
      const date1 = new Date(2020, 1, 3);
      const date2 = new Date(2020, 1, 2);
      expect(minDate(date1, date2)).toEqual(date2);
    });
  });

  describe("both dates are the same", () => {
    it("returns date1", () => {
      const date1 = new Date(2020, 1, 2);
      const date2 = new Date(2020, 1, 2);
      expect(minDate(date1, date2)).toEqual(date1);
    });
  });
});
