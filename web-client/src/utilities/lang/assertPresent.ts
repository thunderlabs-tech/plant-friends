export default function assertPresent<T>(
  value: T | undefined | null,
): asserts value is T {
  if (!value) throw new Error("Value must be present but isn't");
}
