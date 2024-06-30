import type { Temporal } from '@js-temporal/polyfill'

/**
 * Helper function to get the end of a given day.
 * @param date - The date for which the end of the day is needed.
 * @returns The end of the given day.
 */
export const endOf = (date: Temporal.ZonedDateTime): Temporal.ZonedDateTime => {
  return date.with({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  })
}
