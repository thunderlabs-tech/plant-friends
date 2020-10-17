export function isPast(date: Date | undefined, now = Date.now()): boolean {
  if (!date) return false;
  return date.valueOf() <= now;
}
