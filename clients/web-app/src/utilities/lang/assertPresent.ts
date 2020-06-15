export default function assertPresent<T>(value: T | undefined | null): T {
  if (!value) throw new Error("Value must be present but isn't");
  return value;
}
