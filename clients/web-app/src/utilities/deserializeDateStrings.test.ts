import deserializeDateStrings from "./deserializeDateStrings";

describe("deserializeDateStrings()", () => {
  const date = Object.freeze(new Date(2020, 1, 1));

  it("returns scalar values unchanged", () => {
    expect(deserializeDateStrings("foo")).toEqual("foo");
    expect(deserializeDateStrings(123)).toEqual(123);
    expect(deserializeDateStrings(undefined)).toEqual(undefined);
    expect(deserializeDateStrings(null)).toEqual(null);
    expect(deserializeDateStrings(true)).toEqual(true);
  });

  it("converts an ISO8601 date string to a Date instance", () => {
    expect(deserializeDateStrings(date.toISOString())).toEqual(date);
  });

  it("converts an ISO8601 date string with microsecond precision to a Date instance", () => {
    expect(deserializeDateStrings("2020-07-13T21:21:42.835111Z")).toEqual(
      new Date(Date.parse("2020-07-13T21:21:42.835111Z")),
    );
  });

  it("converts the values of an object containing ISO8601 date strings to Date instances", () => {
    const eventWithDateString = { createdAt: date.toISOString() };
    const eventWithDate = { createdAt: date };
    expect(deserializeDateStrings(eventWithDateString)).toEqual(eventWithDate);
  });

  it("converts the values of an array containing ISO8601 date strings to Date instances", () => {
    const dates = [date, new Date(2020, 2, 1)];
    const dateStrings = dates.map((date) => date.toISOString());
    expect(deserializeDateStrings(dateStrings)).toEqual(dates);
  });

  it("traverses nested objects", () => {
    const plantWithDateString = { events: [{ createdAt: date.toISOString() }] };
    const plantWithDate = { events: [{ createdAt: date }] };
    expect(deserializeDateStrings(plantWithDateString)).toEqual(plantWithDate);
  });
});
