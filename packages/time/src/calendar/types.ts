import type { Temporal } from "@js-temporal/polyfill"

export interface Event<TResource extends string = string> {
  id: string;
  start: Temporal.PlainDateTime | Temporal.ZonedDateTime;
  end: Temporal.PlainDateTime | Temporal.ZonedDateTime;
  title: string;
  resources?: TResource[];
}

export interface CalendarStore {
  currentPeriod: Temporal.PlainDate
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'day'
  }
}

export type Day<TEvent extends Event = Event> = {
  date: Temporal.PlainDate
  events: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
}