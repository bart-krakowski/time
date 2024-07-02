import type { Temporal } from '@js-temporal/polyfill'

export type Resource = string | null

export interface Event<TResource extends Resource = Resource> {
  id: string
  start: Temporal.PlainDateTime | Temporal.ZonedDateTime
  end: Temporal.PlainDateTime | Temporal.ZonedDateTime
  title: string
  resources?: TResource[]
}

export interface CalendarStore {
  currentPeriod: Temporal.PlainDate
  activeDate: Temporal.PlainDate
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'workWeek' | 'day'
  }
}

export type Day<
  TResource extends Resource = Resource,
  TEvent extends Event<TResource> = Event<TResource>,
> = {
  date: Temporal.PlainDate
  events: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
}
