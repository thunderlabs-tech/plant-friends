import { Plant } from './Plant';

export default function parseCSV(csvContent: string): Omit<Plant, 'id'>[] {
  const lines = csvContent.split('\n').slice(1);
  return lines.map((line) => {
    const cells = line.split(',');

    return {
      name: cells[1],
      wateringPeriodInDays: parseInt(cells[2], 10),
      wateringTimes: cells[3]
        .slice(1, -1)
        .split(';')
        .map((dateString) => new Date(Date.parse(dateString))),
    };
  });
}
