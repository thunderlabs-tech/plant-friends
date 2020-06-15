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

export default function parseCSV(csvContent: string): Omit<Plant, "id">[] {
  const lines = csvContent.split("\n").slice(1);

  return lines.map((line) => {
    const cells = line.split(",");

    const wateringTimes = parseWateringTimesString(cells[3]);

    return {
      name: cells[1],
      wateringPeriodInDays: parseInt(cells[2], 10),
      wateringTimes,
      timeOfDeath: cells[4] ? new Date(Date.parse(cells[4])) : undefined,
    };
  });
}
