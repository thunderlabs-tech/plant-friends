export function minDate(
  date1: Date | undefined | null,
  date2: Date | undefined | null,
): Date | undefined {
  if (!date1) {
    if (!date2) return undefined;
    return date2;
  } else if (!date2) {
    return date1;
  }
  return date1 < date2 ? date1 : date2;
}
