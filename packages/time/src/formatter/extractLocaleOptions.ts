import type { IDateFormatterOptions, IDateTimeFormatterOptions, ITimeFormatterOptions  } from "./shared";

export function extractLocaleOptions({
  localeMatcher, calendar, numberingSystem, hour12, hourCycle, timeZone, ...formatOptions
}: IDateFormatterOptions | IDateTimeFormatterOptions | ITimeFormatterOptions) {
  return {
    localeMatcher, calendar, numberingSystem, hour12, hourCycle, timeZone, formatOptions
  };
}