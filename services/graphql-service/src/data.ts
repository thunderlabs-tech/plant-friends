export interface PlantData {
  id: number;
  name: string;
  wateredAt: string;
  wateringPeriodInDays: number;
}

export const plants: PlantData[] = [
  { id: 1, name: 'Zabrina', wateredAt: new Date(Date.parse('2020-04-12Z')).toISOString(), wateringPeriodInDays: 5 },
  {
    id: 2,
    name: 'Snake plant 1',
    wateredAt: new Date(Date.parse('2020-04-10Z')).toISOString(),
    wateringPeriodInDays: 14,
  },
  {
    id: 3,
    name: 'Snake plant 2',
    wateredAt: new Date(Date.parse('2020-04-11Z')).toISOString(),
    wateringPeriodInDays: 14,
  },
];
