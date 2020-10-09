/* eslint-disable no-redeclare */
import { format } from "date-fns";

export function formatAwsDateString(date: Date): string;
export function formatAwsDateString(date: Date | null): string | null;
export function formatAwsDateString(date: Date | null): string | null {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
}
