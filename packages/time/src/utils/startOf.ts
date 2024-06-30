import type { Temporal } from '@js-temporal/polyfill'

/**
 * Helper function to get the start of a given day.
 * @param date - The date for which the start of the day is needed.
 * @returns The start of the given day.
 */
export const startOf = (
  date: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime => {
  return date.with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
}
