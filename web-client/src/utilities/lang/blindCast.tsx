/**
 * Casts the input type to the `TargetType` with no type checks (i.e. blindly), as opposed to `castAs()` where the
 * compiler will still prevent converting between incompatible types.
 *
 * The second type parameter is a string describing the reason you want to override the type system. This string is
 * only present at compile-time and won't be output in the final JavaScript.
 *
 * Example:
 *
 *     const stringValue = blindCast<
 *       string,
 *       "string type enforced in function signature but unavailable here"
 *     >(input[key]);
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function blindCast<TargetType, Reason extends string>(
  input: any,
): TargetType {
  return input;
}
