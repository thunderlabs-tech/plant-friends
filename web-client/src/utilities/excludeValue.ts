import blindCast from "./lang/blindCast";

export function excludeValue<T extends unknown, ExcludedValue = unknown>(
  array: (T | ExcludedValue)[],
  excludedValue: ExcludedValue,
): Exclude<T, ExcludedValue>[] {
  return blindCast<
    Exclude<T, ExcludedValue>[],
    "no way to inform compiler of the effect of `filter()`"
  >(array.filter((v) => v !== excludedValue));
}
