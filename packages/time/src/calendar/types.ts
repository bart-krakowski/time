import type { Temporal } from '@js-temporal/polyfill'
import { PossibleDate } from '../utils/parseDate'

export interface Resource {
  id: string
  label: string
}

export type ViewMode = 'month' | 'week' | 'workWeek' | 'day'

export interface Event<TResource extends Resource = Resource> {
  id: string
  start: string
  end: string
  title: string
  resources?: TResource[]
}

export interface CalendarStore {
  currentPeriod: Temporal.PlainDate
  activeDate: Temporal.PlainDate
  viewMode: {
    value: number
    unit: ViewMode
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

export interface DateRange {
  start: PossibleDate | null
  end: PossibleDate | null
}

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export interface TimeSlotOptions {
  /** Start hour (0-23). Default: 0 */
  startHour?: number
  /** End hour (0-24). Default: 24 */
  endHour?: number
  /** Interval in minutes. Default: 60 */
  interval?: number
}
