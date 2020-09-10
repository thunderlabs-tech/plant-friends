import blindCast from "./lang/blindCast";

function notNull(v: any): boolean {
  return v !== null;
}

export function filterNull<T extends unknown>(array: (T | null)[]): T[] {
  return blindCast<
    NonNullable<T>[],
    "no way to inform compiler of the effect of `filter()`"
  >(array.filter(notNull));
}
