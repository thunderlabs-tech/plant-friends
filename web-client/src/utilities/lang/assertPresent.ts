export default function assertPresent<T>(
  value: T | undefined | null,
): asserts value is T {
  if (!value) throw new Error("Value must be present but isn't");
}

export function getAssertPresent<T>(value: T | undefined | null): T {
  assertPresent(value);
  return value;
}
