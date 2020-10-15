import { formatISO } from "date-fns";
/* eslint-disable no-redeclare */

export default function formatAwsDateTimeString(value: Date): string;
export default function formatAwsDateTimeString(
  value: Date | null,
): string | null;
export default function formatAwsDateTimeString(
  value: Date | undefined,
): string | undefined;
export default function formatAwsDateTimeString(
  value: Date | undefined | null,
): string | undefined | null {
  if (value) return formatISO(value);
  return value;
}
