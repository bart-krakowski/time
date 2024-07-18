import type { Temporal } from '@js-temporal/polyfill'

/**
 * Helper function to get the end of a given temporal unit.
 * @param date {Temporal.ZonedDateTime} - The date for which the end of the unit is needed.
 * @param unit {Unit} - The unit for which to find the end ('day', 'week', 'month', 'year', 'workWeek', 'decade').
 * @returns {Temporal.ZonedDateTime} The end of the given unit.
 */
export const endOf = (date: Temporal.ZonedDateTime, unit: 'day' | 'week' | 'month' | 'year' | 'workWeek' | 'decade'): Temporal.ZonedDateTime => {
  switch (unit) {
    case 'day':
      return date.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
    case 'week': {
      const endOfWeek = date.add({ days: 7 - date.dayOfWeek }).with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
      return endOfWeek;
    }
    case 'month': {
      const lastDayOfMonth = date.with({ day: 1 }).add({ months: 1 }).subtract({ days: 1 });
      return lastDayOfMonth.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
    }
    case 'year': {
      const lastDayOfYear = date.with({ month: 12, day: 31 });
      return lastDayOfYear.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
    }
    case 'workWeek': {
      const endOfWorkWeek = date.add({ days: 5 - date.dayOfWeek }).with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
      return endOfWorkWeek;
    }
    case 'decade': {
      const lastYearOfDecade = date.with({ year: date.year - (date.year % 10) + 9 });
      const lastDayOfDecade = lastYearOfDecade.with({ month: 12, day: 31 });
      return lastDayOfDecade.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });
    }
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}
