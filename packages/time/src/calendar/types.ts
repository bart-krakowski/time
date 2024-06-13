import type { Temporal } from "@js-temporal/polyfill"

export interface Event {
  id: string;
  startDate: Temporal.PlainDateTime;
  endDate: Temporal.PlainDateTime;
  title: string;
}

export interface CalendarState {
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