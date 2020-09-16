import { formatISO } from "date-fns";
/* eslint-disable no-redeclare */

export default function dateToString(value: Date): string;
export default function dateToString(value: Date | null): string | null;
export default function dateToString(
  value: Date | undefined,
): string | undefined;
export default function dateToString(
  value: Date | undefined | null,
): string | undefined | null {
  if (value) return formatISO(value);
  return undefined;
}
