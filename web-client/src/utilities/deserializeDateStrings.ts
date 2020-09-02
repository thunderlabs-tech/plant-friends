import JsonValue from "./JsonValue";
import { mapValues } from "lodash";
import blindCast from "./lang/blindCast";

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3,6})?(Z|[+-](\d{2}):(\d{2}))$/;

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

  return blindCast<
    OutputType,
    "Can't express the relationship between the input and OutputType so the caller must pass it in"
  >(result);
}
