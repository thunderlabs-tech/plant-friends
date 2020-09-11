import { parseISO, isValid } from "date-fns";
export function parseDateString(input: string): Date;
export function parseDateString(input: string | undefined): Date | undefined;
export function parseDateString(input: string | null): Date | null;
export function parseDateString(
  input: string | undefined | null,
): Date | undefined | null {
  if (input === undefined || input === null) return input;
  const parsedDate = parseISO(input);
  if (!isValid(parsedDate)) throw new Error(`Invalid date string '${input}'`);
  return parsedDate;
}
