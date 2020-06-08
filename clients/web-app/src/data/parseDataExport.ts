import { Plant } from "./Plant";

function parseWateringTimesString(wateringTimesString: string): Date[] {
  const withoutEnclosingQuotes = wateringTimesString.slice(1, -1);

  if (withoutEnclosingQuotes.length === 0) {
    return [];
  }

  return withoutEnclosingQuotes
    .split(";")
    .map((dateString) => new Date(Date.parse(dateString)));
}

export default function parseDataExport(
  csvContent: string,
): Omit<Plant, "id">[] {
  const lines = csvContent.split("\n").slice(1);

  return lines.map((line) => {
    const cells = line.split(",");
    const [
      // @ts-ignore
      id,
      name,
      wateringPeriodInDaysString,
      wateringTimesString,
      timeOfDeathString,
    ] = cells;

    const wateringTimes = parseWateringTimesString(wateringTimesString);

    return {
      name,
      wateringPeriodInDays: parseInt(wateringPeriodInDaysString, 10),
      wateringTimes,
      timeOfDeath: timeOfDeathString
        ? new Date(Date.parse(timeOfDeathString))
        : undefined,
    };
  });
}
