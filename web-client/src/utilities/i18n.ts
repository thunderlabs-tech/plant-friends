import deepFreeze from "deep-freeze";
import { mapValues } from "lodash";
import castAs from "./lang/castAs";
import { PlantEventType } from "src/gen/API";
import { MapEach } from "src/utilities/lang/MapEach";

const locale = undefined; // TODO: detect locale; undefined uses browser default

export const FORMATS = deepFreeze({
  dateTime: {
    dateTime: castAs<Partial<Intl.DateTimeFormatOptions>>({
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    date: castAs<Partial<Intl.DateTimeFormatOptions>>({
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  },
});

export const dateFormatters = mapValues(
  FORMATS.dateTime,
  (format) => new Intl.DateTimeFormat(locale, format),
);

export const plantEventTypeToAction: MapEach<
  PlantEventType,
  string
> = Object.freeze({
  [PlantEventType.WATERED]: "water",
  [PlantEventType.FERTILIZED]: "fertilize",
} as const);
