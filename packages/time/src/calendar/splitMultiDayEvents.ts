import { Temporal } from '@js-temporal/polyfill'
import type { Event } from './types'

export const splitMultiDayEvents = <
  TResource extends string | null = null,
  TEvent extends Event<TResource> = Event<TResource>,
>(
  event: TEvent,
  timeZone: Temporal.TimeZoneLike,
): TEvent[] => {
  const startDate =
    event.start instanceof Temporal.PlainDateTime
      ? event.start.toZonedDateTime(timeZone)
      : event.start
  const endDate =
    event.end instanceof Temporal.PlainDateTime
      ? event.end.toZonedDateTime(timeZone)
      : event.end
  const events: TEvent[] = []

  let currentDay = startDate
  while (Temporal.ZonedDateTime.compare(currentDay, endDate) < 0) {
    const startOfCurrentDay = currentDay.with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    const endOfCurrentDay = currentDay.with({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })

    const eventStart =
      Temporal.PlainDateTime.compare(currentDay, startDate) === 0
        ? startDate
        : startOfCurrentDay
    const eventEnd =
      Temporal.PlainDateTime.compare(endDate, endOfCurrentDay) <= 0
        ? endDate
        : endOfCurrentDay

    events.push({ ...event, start: eventStart, end: eventEnd })

    currentDay = startOfCurrentDay.add({ days: 1 })
  }

  return events
}
