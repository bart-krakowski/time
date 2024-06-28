import type { Temporal } from "@js-temporal/polyfill"

export interface Event {
  id: string;
  start: Temporal.PlainDateTime | Temporal.ZonedDateTime;
  end: Temporal.PlainDateTime | Temporal.ZonedDateTime;
  title: string;
}

export interface CalendarStore {
  currentPeriod: Temporal.PlainDate
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'day'
  }
  currentTime: Temporal.PlainDateTime
}

export type Day<TEvent extends Event = Event> = {
  date: Temporal.PlainDate
  events: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
}