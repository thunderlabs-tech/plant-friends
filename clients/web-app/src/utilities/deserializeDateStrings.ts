import JsonValue from "./JsonValue";
import { mapValues } from "lodash";

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-](\d{2}):(\d{2}))$/;

export default function deserializeDateStrings<OutputType = unknown>(
  value: JsonValue,
): OutputType {
  let result;

  if (typeof value === "string" && value.match(ISO_8601_REGEX)) {
    result = new Date(value);
  } else if (value instanceof Array) {
    result = value.map(deserializeDateStrings);
  } else if (typeof value === "object" && value !== null) {
    result = mapValues(value, deserializeDateStrings);
  } else {
    result = value;
  }

  // It's impossible to express the relationship between `OutputType` and the intial value so we let the caller pass in
  // the return type and blindly cast our result to that
  return (result as any) as OutputType;
}
