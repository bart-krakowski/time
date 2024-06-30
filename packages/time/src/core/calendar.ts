import { Store } from '@tanstack/store'
import { Temporal } from '@js-temporal/polyfill'
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../utils'
import { generateDateRange } from '../calendar/generateDateRange'
import { splitMultiDayEvents } from '../calendar/splitMultiDayEvents'
import { getEventProps } from '../calendar/getEventProps'
import { groupDaysBy } from '../calendar/groupDaysBy'
import { getDateDefaults } from '../utils/dateDefaults'
import type { GroupDaysByProps } from '../calendar/groupDaysBy'
import type { CalendarStore, Day, Event, Resource } from '../calendar/types'

import './weekInfoPolyfill'

export type * from '../calendar/types'

/**
 * Represents the configuration for the current viewing mode of a calendar,
 * specifying the scale and unit of time.
 */
export interface ViewMode {
  /** The number of units for the view mode. */
  value: number
  /** The unit of time that the calendar view should display (month, week, or day). */
  unit: 'month' | 'week' | 'day'
}

/**
 * Configuration options for initializing a CalendarCore instance, allowing customization
 * of events, locale, time zone, and the calendar system.
 * @template TEvent - Specifies the event type, extending a base Event type.
 */
export interface CalendarCoreOptions<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> {
  /** An optional array of events to be handled by the calendar. */
  events?: TEvent[] | null
  /** The initial view mode configuration of the calendar. */
  viewMode: CalendarStore['viewMode']
  /** Optional locale for date formatting. Uses a BCP 47 language tag. */
  locale?: Intl.UnicodeBCP47LocaleIdentifier
  /** Optional time zone specification for the calendar. */
  timeZone?: Temporal.TimeZoneLike
  /** Optional calendar system to be used. */
  calendar?: Temporal.CalendarLike
  /** Optional resources to be used in the calendar. */
  resources?: TResource[] | null
}

/**
 * The API surface provided by CalendarCore, allowing interaction with the calendar's state
 * and manipulation of its settings and data.
 * @template TEvent - The type of events handled by the calendar.
 */
interface CalendarActions<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> {
  /** Navigates to the previous period according to the current view mode. */
  goToPreviousPeriod: () => void
  /** Navigates to the next period according to the current view mode. */
  goToNextPeriod: () => void
  /** Resets the view to the current period based on today's date. */
  goToCurrentPeriod: () => void
  /** Navigates to a specific date. */
  goToSpecificPeriod: (date: Temporal.PlainDate) => void
  /** Changes the current view mode of the calendar. */
  changeViewMode: (newViewMode: CalendarStore['viewMode']) => void
  /** Retrieves styling properties for a specific event, identified by ID. */
  getEventProps: (id: Event['id']) => {
    eventHeightInMinutes: number
    isSplitEvent: boolean
    overlappingEvents: TEvent[]
  } | null

  /** Groups days by a specified unit. */
  groupDaysBy: (
    props: Omit<GroupDaysByProps<TResource, TEvent>, 'weekStartsOn'>,
  ) => (Day<TResource, TEvent> | null)[][]
}

interface CalendarState<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> {
  /** The currently focused date period in the calendar. */
  currentPeriod: CalendarStore['currentPeriod']
  /** The current view mode of the calendar. */
  viewMode: CalendarStore['viewMode']
  /** An array of days, each potentially containing events. */
  days: Array<Day<TResource, TEvent>>
  /** An array of names for the days of the week, localized to the calendar's locale. */
  daysNames: string[]
}

export interface CalendarApi<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> extends CalendarActions<TResource, TEvent>,
    CalendarState<TResource, TEvent> {}

/**
 * Core functionality for a calendar system, managing the state and operations of the calendar,
 * such as navigating through time periods, handling events, and adjusting settings.
 * @template TEvent - The type of events managed by the calendar.
 */
export class CalendarCore<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> implements CalendarActions<TResource, TEvent>
{
  store: Store<CalendarStore>
  options: Required<CalendarCoreOptions<TResource, TEvent>>

  constructor(options: CalendarCoreOptions<TResource, TEvent>) {
    const defaults = getDateDefaults()
    this.options = {
      ...options,
      locale: options.locale || defaults.locale,
      timeZone: options.timeZone || defaults.timeZone,
      calendar: options.calendar || defaults.calendar,
      events: options.events || null,
      resources: options.resources || null,
    }

    this.store = new Store<CalendarStore>({
      currentPeriod: Temporal.Now.plainDateISO().withCalendar(
        this.options.calendar,
      ),
      viewMode: options.viewMode,
    })
  }

  private getFirstDayOfMonth() {
    return getFirstDayOfMonth(
      this.store.state.currentPeriod
        .toString({ calendarName: 'auto' })
        .substring(0, 7),
    )
  }

  private getFirstDayOfWeek() {
    return getFirstDayOfWeek(
      this.store.state.currentPeriod.toString(),
      this.options.locale,
    )
  }

  private getCalendarDays() {
    const start =
      this.store.state.viewMode.unit === 'month'
        ? this.getFirstDayOfMonth().subtract({
            days:
              (this.getFirstDayOfMonth().dayOfWeek -
                (this.getFirstDayOfWeek().dayOfWeek + 1) +
                7) %
              7,
          })
        : this.store.state.currentPeriod

    let end
    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const lastDayOfMonth = this.getFirstDayOfMonth()
          .add({ months: this.store.state.viewMode.value })
          .subtract({ days: 1 })
        const lastDayOfMonthWeekDay =
          (lastDayOfMonth.dayOfWeek -
            (this.getFirstDayOfWeek().dayOfWeek + 1) +
            7) %
          7
        end = lastDayOfMonth.add({ days: 6 - lastDayOfMonthWeekDay })
        break
      }
      case 'week': {
        end = this.getFirstDayOfWeek().add({
          days: 7 * this.store.state.viewMode.value - 1,
        })
        break
      }
      case 'day': {
        end = this.store.state.currentPeriod.add({
          days: this.store.state.viewMode.value - 1,
        })
        break
      }
    }

    const allDays = generateDateRange(start, end)
    const startMonth = this.store.state.currentPeriod.month
    const endMonth = this.store.state.currentPeriod.add({
      months: this.store.state.viewMode.value - 1,
    }).month

    return allDays.filter(
      (day) => day.month >= startMonth && day.month <= endMonth,
    )
  }

  private getEventMap() {
    const map = new Map<string, TEvent[]>()
    this.options.events?.forEach((event) => {
      const eventStartDate =
        event.start instanceof Temporal.PlainDateTime
          ? event.start.toZonedDateTime(this.options.timeZone)
          : event.start
      const eventEndDate =
        event.end instanceof Temporal.PlainDateTime
          ? event.end.toZonedDateTime(this.options.timeZone)
          : event.end
      if (Temporal.ZonedDateTime.compare(eventStartDate, eventEndDate) !== 0) {
        const splitEvents = splitMultiDayEvents<TResource, TEvent>(
          event,
          this.options.timeZone,
        )
        splitEvents.forEach((splitEvent) => {
          const splitKey = splitEvent.start.toString().split('T')[0]
          if (splitKey) {
            if (!map.has(splitKey)) map.set(splitKey, [])
            map.get(splitKey)?.push(splitEvent)
          }
        })
      } else {
        const eventKey = event.start.toString().split('T')[0]
        if (eventKey) {
          if (!map.has(eventKey)) map.set(eventKey, [])
          map.get(eventKey)?.push(event)
        }
      }
    })
    return map
  }

  getDaysWithEvents() {
    const calendarDays = this.getCalendarDays()
    const eventMap = this.getEventMap()
    return calendarDays.map((day) => {
      const dayKey = day.toString()
      const dailyEvents = eventMap.get(dayKey) ?? []
      const currentMonthRange = Array.from(
        { length: this.store.state.viewMode.value },
        (_, i) => this.store.state.currentPeriod.add({ months: i }).month,
      )
      const isInCurrentPeriod = currentMonthRange.includes(day.month)
      return {
        date: day,
        events: dailyEvents,
        isToday:
          Temporal.PlainDate.compare(day, Temporal.Now.plainDateISO()) === 0,
        isInCurrentPeriod,
      }
    })
  }

  getDaysNames() {
    const baseDate = Temporal.PlainDate.from('2024-01-01')
    return Array.from({ length: 7 }).map((_, i) =>
      baseDate
        .add({ days: (i + (this.getFirstDayOfWeek().dayOfWeek + 1)) % 7 })
        .toLocaleString(this.options.locale, { weekday: 'short' }),
    )
  }

  changeViewMode(newViewMode: CalendarStore['viewMode']) {
    this.store.setState((prev) => ({
      ...prev,
      viewMode: newViewMode,
    }))
  }

  goToPreviousPeriod() {
    const firstDayOfMonth = this.getFirstDayOfMonth()
    const firstDayOfWeek = this.getFirstDayOfWeek()

    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const firstDayOfPrevMonth = firstDayOfMonth.subtract({
          months: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfPrevMonth,
        }))
        break
      }

      case 'week': {
        const firstDayOfPrevWeek = firstDayOfWeek.subtract({
          weeks: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfPrevWeek,
        }))
        break
      }

      case 'day': {
        const prevCustomStart = this.store.state.currentPeriod.subtract({
          days: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: prevCustomStart,
        }))
        break
      }
    }
  }

  goToNextPeriod() {
    const firstDayOfMonth = this.getFirstDayOfMonth()
    const firstDayOfWeek = this.getFirstDayOfWeek()

    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const firstDayOfNextMonth = firstDayOfMonth.add({
          months: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfNextMonth,
        }))
        break
      }

      case 'week': {
        const firstDayOfNextWeek = firstDayOfWeek.add({
          weeks: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfNextWeek,
        }))
        break
      }

      case 'day': {
        const nextCustomStart = this.store.state.currentPeriod.add({
          days: this.store.state.viewMode.value,
        })
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: nextCustomStart,
        }))
        break
      }
    }
  }

  goToCurrentPeriod() {
    this.store.setState((prev) => ({
      ...prev,
      currentPeriod: Temporal.Now.plainDateISO(),
    }))
  }

  goToSpecificPeriod(date: Temporal.PlainDate) {
    this.store.setState((prev) => ({
      ...prev,
      currentPeriod: date,
    }))
  }

  getEventProps(id: Event['id']) {
    return getEventProps(
      this.getEventMap(),
      id,
      this.store.state,
    ) as ReturnType<CalendarActions<TResource, TEvent>['getEventProps']>
  }

  groupDaysBy({
    days,
    unit,
    fillMissingDays = true,
  }: Omit<GroupDaysByProps<TResource, TEvent>, 'weekStartsOn'>) {
    return groupDaysBy<TResource, TEvent>({
      days,
      unit,
      fillMissingDays,
      weekStartsOn: this.getFirstDayOfWeek().dayOfWeek,
    } as GroupDaysByProps<TResource, TEvent>)
  }
}
