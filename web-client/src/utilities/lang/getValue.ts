export default function getValue<
  TargetObject extends Record<string, unknown>,
  Key extends keyof TargetObject
>(object: TargetObject, key: Key): TargetObject[Key] {
  return object[key];
}
