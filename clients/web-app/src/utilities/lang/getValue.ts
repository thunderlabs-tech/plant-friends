export default function getValue<
  Object extends object,
  Key extends keyof Object
>(object: Object, key: Key): Object[Key] {
  return object[key];
}
