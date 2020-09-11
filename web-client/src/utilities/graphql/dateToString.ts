import { formatISO } from "date-fns";

export default function dateToString(
  value: Date | undefined | null,
): string | undefined {
  if (value) return formatISO(value);
  return undefined;
}
