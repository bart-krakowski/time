import type { Temporal } from '@js-temporal/polyfill'

/**
 * Helper function to get the start of a given temporal unit.
 * @param date {Temporal.ZonedDateTime} - The date for which the start of the unit is needed.
 * @param unit {Unit} - The unit for which to find the start ('day', 'week', 'month', 'year', 'workWeek', 'decade').
 * @returns {Temporal.ZonedDateTime} The start of the given unit.
 */
export const startOf = (date: Temporal.ZonedDateTime, unit: 'day' | 'week' | 'month' | 'year' | 'workWeek' | 'decade'): Temporal.ZonedDateTime => {
  switch (unit) {
    case 'day':
      return date.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    case 'week': {
      const startOfWeek = date.subtract({ days: date.dayOfWeek - 1 }).with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      return startOfWeek;
    }
    case 'month': {
      const startOfMonth = date.with({ day: 1 }).with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      return startOfMonth;
    }
    case 'year': {
      const startOfYear = date.with({ month: 1, day: 1 }).with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      return startOfYear;
    }
    case 'workWeek': {
      const dayOfWeek = date.dayOfWeek;
      const startOfWorkWeek = dayOfWeek === 1 ? date : date.subtract({ days: dayOfWeek - 1 });
      return startOfWorkWeek.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }
    case 'decade': {
      const startOfDecade = date.with({ year: date.year - (date.year % 10), month: 1, day: 1 }).with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      return startOfDecade;
    }
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}
