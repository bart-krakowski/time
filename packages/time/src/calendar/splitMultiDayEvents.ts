import { Temporal } from '@js-temporal/polyfill'
import { endOf, startOf } from '../utils'
import type { Event, Resource } from './types'

export const splitMultiDayEvents = <
  TResource extends Resource = Resource,
  TEvent extends Event<TResource> = Event<TResource>,
>(
  event: TEvent,
  timeZone: Temporal.TimeZoneLike,
): TEvent[] => {
  const startDate = Temporal.PlainDateTime.from(event.start).toZonedDateTime(timeZone)
  const endDate = Temporal.PlainDateTime.from(event.end).toZonedDateTime(timeZone)
  const events: TEvent[] = []

  let currentDay = startDate
  while (Temporal.ZonedDateTime.compare(currentDay, endDate) < 0) {
    const eventStart =
      Temporal.PlainDateTime.compare(currentDay, startDate) === 0
        ? startDate
        : startOf(currentDay)
    const eventEnd =
      Temporal.PlainDateTime.compare(endDate, endOf(currentDay)) <= 0
        ? endDate
        : endOf(currentDay)

    events.push({ ...event, start: eventStart, end: eventEnd })

    currentDay = startOf(currentDay).add({ days: 1 })
  }

  return events
}
