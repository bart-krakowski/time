import { useCallback, useEffect, useMemo, useTransition } from 'react'
import { Temporal } from '@js-temporal/polyfill'

import { getFirstDayOfMonth, getFirstDayOfWeek } from '@tanstack/time'
import { actions } from './calendarActions'
import { useCalendarReducer } from './useCalendarReducer'
import type { UseCalendarAction } from './calendarActions'
import type { Event, UseCalendarState } from './useCalendarState'
import type { CSSProperties } from 'react'

type Day<TEvent extends Event = Event> = {
  date: Temporal.PlainDate
  events: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
}

interface UseCalendarProps<
  TEvent extends Event,
  TState extends UseCalendarState = UseCalendarState,
> {
  /**
   * The day of the week the calendar should start on (0 for Sunday, 6 for Saturday).
   * @default 1
   */
  weekStartsOn?: number
  /**
   * An array of events that the calendar should display.
   */
  events?: TEvent[]
  /**
   * The initial view mode of the calendar. It can be 'month', 'week', or a number representing the number of days in a custom view mode.
   */
  viewMode: TState['viewMode']
  /**
   * The locale to use for formatting dates and times.
   */
  locale?: Parameters<Temporal.PlainDate['toLocaleString']>['0']
  /**
   * Callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
   */
  onChangeViewMode?: (viewMode: TState['viewMode']) => void
  /**
   * Custom reducer function to manage the state of the calendar.
   */
  reducer?: <TAction extends UseCalendarAction = UseCalendarAction>(
    state: TState,
    action: TAction,
  ) => TState
}

const splitMultiDayEvents = <TEvent extends Event>(event: TEvent): TEvent[] => {
  const startDate = Temporal.PlainDateTime.from(event.startDate)
  const endDate = Temporal.PlainDateTime.from(event.endDate)
  const events: TEvent[] = []

  let currentDay = startDate
  while (
    Temporal.PlainDate.compare(
      currentDay.toPlainDate(),
      endDate.toPlainDate(),
    ) < 0
  ) {
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

    events.push({ ...event, startDate: eventStart, endDate: eventEnd })

    currentDay = startOfCurrentDay.add({ days: 1 })
  }

  return events
}

const generateDateRange = (
  start: Temporal.PlainDate,
  end: Temporal.PlainDate,
) => {
  const dates: Temporal.PlainDate[] = []
  let current = start
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    dates.push(current)
    current = current.add({ days: 1 })
  }
  return dates
}

/**
 * Hook to manage the state and behavior of a calendar.
 *
 * @param {UseCalendarProps} props - The configuration properties for the calendar.
 * @param {number} [props.weekStartsOn=1] - The day of the week the calendar should start on (1 for Monday, 7 for Sunday).
 * @param {TEvent[]} [props.events] - An array of events that the calendar should display.
 * @param {'month' | 'week' | number} props.viewMode - The initial view mode of the calendar. It can be 'month', 'week', or a number representing the number of days in a custom view mode.
 * @param {Intl.LocalesArgument} [props.locale] - The locale to use for formatting dates and times.
 * @param {Function} [props.onChangeViewMode] - Callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
 * @param {Function} [props.reducer] - Custom reducer function to manage the state of the calendar.
 *
 * @returns {Object} calendarState - The state and functions for managing the calendar.
 * @returns {Temporal.PlainDate} calendarState.currentPeriod - The current period displayed by the calendar.
 * @returns {Function} calendarState.goToPreviousPeriod - Function to navigate to the previous period.
 * @returns {Function} calendarState.goToNextPeriod - Function to navigate to the next period.
 * @returns {Function} calendarState.goToCurrentPeriod - Function to navigate to the current period.
 * @returns {Function} calendarState.goToSpecificPeriod - Function to navigate to a specific period.
 * @returns {Array<Array<{ date: Temporal.PlainDate; events: TEvent[]; isToday: boolean; isInCurrentPeriod: boolean }>>} calendarState.days - The calendar grid, where each cell contains the date and events for that day.
 * @returns {string[]} calendarState.daysNames - An array of day names based on the locale and week start day.
 * @returns {'month' | 'week' | number} calendarState.viewMode - The current view mode of the calendar.
 * @returns {Function} calendarState.changeViewMode - Function to change the view mode of the calendar.
 * @returns {Function} calendarState.getEventProps - Function to retrieve the style properties for a specific event based on its ID.
 * @returns {Function} calendarState.currentTimeMarkerProps - Function to retrieve the style properties and current time for the current time marker.
 */
export const useCalendar = <
  TEvent extends Event,
  TState extends UseCalendarState = UseCalendarState,
>({
  weekStartsOn = 1,
  events,
  viewMode: initialViewMode,
  locale,
  onChangeViewMode,
  reducer,
}: UseCalendarProps<TEvent, TState>) => {
  const today = Temporal.Now.plainDateISO()
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useCalendarReducer(
    {
      currentPeriod: today,
      viewMode: initialViewMode,
      currentTime: Temporal.Now.plainDateTimeISO(),
    } as TState,
    reducer,
  )

  const firstDayOfMonth = useMemo(
    () =>
      getFirstDayOfMonth(
        state.currentPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
      ),
    [state.currentPeriod],
  )

  const firstDayOfWeek = useMemo(
    () => getFirstDayOfWeek(state.currentPeriod.toString(), weekStartsOn),
    [state.currentPeriod, weekStartsOn],
  )

  const calendarDays = useMemo(() => {
    const start =
      state.viewMode.unit === 'month'
        ? firstDayOfMonth.subtract({
            days: (firstDayOfMonth.dayOfWeek - weekStartsOn + 7) % 7,
          })
        : state.currentPeriod

    let end
    switch (state.viewMode.unit) {
      case 'month': {
        const lastDayOfMonth = firstDayOfMonth
          .add({ months: state.viewMode.value })
          .subtract({ days: 1 })
        const lastDayOfMonthWeekDay =
          (lastDayOfMonth.dayOfWeek - weekStartsOn + 7) % 7
        end = lastDayOfMonth.add({ days: 6 - lastDayOfMonthWeekDay })
        break
      }
      case 'week': {
        end = firstDayOfWeek.add({ days: 7 * state.viewMode.value - 1 })
        break
      }
      case 'day': {
        end = state.currentPeriod.add({ days: state.viewMode.value - 1 })
        break
      }
    }

    const allDays = generateDateRange(start, end)
    const startMonth = state.currentPeriod.month
    const endMonth = state.currentPeriod.add({
      months: state.viewMode.value - 1,
    }).month

    return allDays.filter(
      (day) => day.month >= startMonth && day.month <= endMonth,
    )
  }, [
    state.viewMode,
    firstDayOfMonth,
    firstDayOfWeek,
    weekStartsOn,
    state.currentPeriod,
  ])

  const eventMap = useMemo(() => {
    const map = new Map<string, TEvent[]>()
    events?.forEach((event) => {
      const eventStartDate = Temporal.PlainDateTime.from(event.startDate)
      const eventEndDate = Temporal.PlainDateTime.from(event.endDate)
      if (
        Temporal.PlainDate.compare(
          eventStartDate.toPlainDate(),
          eventEndDate.toPlainDate(),
        ) !== 0
      ) {
        const splitEvents = splitMultiDayEvents(event)
        splitEvents.forEach((splitEvent) => {
          const splitKey = splitEvent.startDate.toString().split('T')[0]
          if (splitKey) {
            if (!map.has(splitKey)) map.set(splitKey, [])
            map.get(splitKey)?.push(splitEvent)
          }
        })
      } else {
        const eventKey = event.startDate.toString().split('T')[0]
        if (eventKey) {
          if (!map.has(eventKey)) map.set(eventKey, [])
          map.get(eventKey)?.push(event)
        }
      }
    })
    return map
  }, [events])

  const daysWithEvents = useMemo(
    () =>
      calendarDays.map((day) => {
        const dayKey = day.toString()
        const dailyEvents = eventMap.get(dayKey) ?? []
        const currentMonthRange = Array.from(
          { length: state.viewMode.value },
          (_, i) => state.currentPeriod.add({ months: i }).month,
        )
        const isInCurrentPeriod = currentMonthRange.includes(day.month)
        return {
          date: day,
          events: dailyEvents,
          isToday:
            Temporal.PlainDate.compare(day, Temporal.Now.plainDateISO()) === 0,
          isInCurrentPeriod,
        }
      }),
    [calendarDays, eventMap, state.viewMode, state.currentPeriod],
  )

  const goToPreviousPeriod = useCallback(
    () =>
      startTransition(() =>
        dispatch(actions.goToPreviousPeriod({ weekStartsOn })),
      ),
    [dispatch, weekStartsOn],
  )

  const goToNextPeriod = useCallback(
    () =>
      startTransition(() => dispatch(actions.goToNextPeriod({ weekStartsOn }))),
    [dispatch, weekStartsOn],
  )

  const goToCurrentPeriod = useCallback(
    () =>
      startTransition(() =>
        dispatch(actions.setCurrentPeriod(Temporal.Now.plainDateISO())),
      ),
    [dispatch],
  )

  const goToSpecificPeriod = useCallback(
    (date: Temporal.PlainDate) =>
      startTransition(() => dispatch(actions.setCurrentPeriod(date))),
    [dispatch],
  )

  const changeViewMode = useCallback(
    (newViewMode: TState['viewMode']) => {
      startTransition(() => {
        dispatch(actions.setViewMode(newViewMode))
        onChangeViewMode?.(newViewMode)
      })
    },
    [dispatch, onChangeViewMode],
  )

  const getEventProps = useCallback(
    (id: Event['id']): { style: CSSProperties } | null => {
      const event = [...eventMap.values()]
        .flat()
        .find((currEvent) => currEvent.id === id)
      if (!event) return null

      const eventStartDate = Temporal.PlainDateTime.from(event.startDate)
      const eventEndDate = Temporal.PlainDateTime.from(event.endDate)
      const isSplitEvent =
        Temporal.PlainDate.compare(
          eventStartDate.toPlainDate(),
          eventEndDate.toPlainDate(),
        ) !== 0

      let percentageOfDay
      let eventHeightInMinutes

      if (isSplitEvent) {
        const isStartPart =
          eventStartDate.hour !== 0 || eventStartDate.minute !== 0
        if (isStartPart) {
          const eventTimeInMinutes =
            eventStartDate.hour * 60 + eventStartDate.minute
          percentageOfDay = (eventTimeInMinutes / (24 * 60)) * 100
          eventHeightInMinutes = 24 * 60 - eventTimeInMinutes
        } else {
          percentageOfDay = 0
          eventHeightInMinutes = eventEndDate.hour * 60 + eventEndDate.minute
        }
      } else {
        const eventTimeInMinutes =
          eventStartDate.hour * 60 + eventStartDate.minute
        percentageOfDay = (eventTimeInMinutes / (24 * 60)) * 100
        const endTimeInMinutes = eventEndDate.hour * 60 + eventEndDate.minute
        eventHeightInMinutes = endTimeInMinutes - eventTimeInMinutes
      }

      const eventHeight = Math.min((eventHeightInMinutes / (24 * 60)) * 100, 20)

      const overlappingEvents = [...eventMap.values()].flat().filter((e) => {
        const eStartDate = Temporal.PlainDateTime.from(e.startDate)
        const eEndDate = Temporal.PlainDateTime.from(e.endDate)
        return (
          (e.id !== id &&
            Temporal.PlainDateTime.compare(eventStartDate, eStartDate) >= 0 &&
            Temporal.PlainDateTime.compare(eventStartDate, eEndDate) <= 0) ||
          (Temporal.PlainDateTime.compare(eventEndDate, eStartDate) >= 0 &&
            Temporal.PlainDateTime.compare(eventEndDate, eEndDate) <= 0) ||
          (Temporal.PlainDateTime.compare(eStartDate, eventStartDate) >= 0 &&
            Temporal.PlainDateTime.compare(eStartDate, eventEndDate) <= 0) ||
          (Temporal.PlainDateTime.compare(eEndDate, eventStartDate) >= 0 &&
            Temporal.PlainDateTime.compare(eEndDate, eventEndDate) <= 0)
        )
      })

      const eventIndex = overlappingEvents.findIndex((e) => e.id === id)
      const totalOverlaps = overlappingEvents.length
      const sidePadding = 2
      const innerPadding = 2
      const totalInnerPadding = (totalOverlaps - 1) * innerPadding
      const availableWidth = 100 - totalInnerPadding - 2 * sidePadding
      const eventWidth =
        totalOverlaps > 0
          ? availableWidth / totalOverlaps
          : 100 - 2 * sidePadding
      const eventLeft = sidePadding + eventIndex * (eventWidth + innerPadding)

      if (state.viewMode.unit === 'week' || state.viewMode.unit === 'day') {
        return {
          style: {
            position: 'absolute',
            top: `min(${percentageOfDay}%, calc(100% - 55px))`,
            left: `${eventLeft}%`,
            width: `${eventWidth}%`,
            margin: 0,
            height: `${eventHeight}%`,
          },
        }
      }

      return null
    },
    [eventMap, state.viewMode],
  )

  useEffect(() => {
    const intervalId = setInterval(
      () =>
        dispatch(actions.updateCurrentTime(Temporal.Now.plainDateTimeISO())),
      60000,
    )
    return () => clearInterval(intervalId)
  }, [dispatch])

  const currentTimeMarkerProps = useCallback(() => {
    const { hour, minute } = state.currentTime
    const currentTimeInMinutes = hour * 60 + minute
    const percentageOfDay = (currentTimeInMinutes / (24 * 60)) * 100

    return {
      style: {
        position: 'absolute',
        top: `${percentageOfDay}%`,
        left: 0,
      },
      currentTime: state.currentTime.toString().split('T')[1]?.substring(0, 5),
    }
  }, [state.currentTime])

  const daysNames = useMemo(() => {
    const baseDate = Temporal.PlainDate.from('2024-01-01')
    return Array.from({ length: 7 }).map((_, i) =>
      baseDate
        .add({ days: (i + weekStartsOn - 1) % 7 })
        .toLocaleString(locale, { weekday: 'short' }),
    )
  }, [locale, weekStartsOn])

  const groupDaysBy = useCallback(
    ({
      days,
      unit,
      fillMissingDays = true,
    }:
      | {
          days: (Day<TEvent> | null)[]
          unit: 'month'
          fillMissingDays?: never
        }
      | {
          days: (Day<TEvent> | null)[]
          unit: 'week'
          fillMissingDays?: boolean
        }) => {
      const groups: (Day | null)[][] = []

      switch (unit) {
        case 'month': {
          let currentMonth: (Day<TEvent> | null)[] = []
          days.forEach((day) => {
            if (
              currentMonth.length > 0 &&
              day?.date.month !== currentMonth[0]?.date.month
            ) {
              groups.push(currentMonth)
              currentMonth = []
            }
            currentMonth.push(day)
          })
          if (currentMonth.length > 0) {
            groups.push(currentMonth)
          }
          break
        }

        case 'week': {
          const weeks: (Day | null)[][] = []
          let currentWeek: (Day | null)[] = []

          days.forEach((day) => {
            if (
              currentWeek.length === 0 &&
              day?.date.dayOfWeek !== weekStartsOn
            ) {
              if (day) {
                const dayOfWeek = (day.date.dayOfWeek - weekStartsOn + 7) % 7
                for (let i = 0; i < dayOfWeek; i++) {
                  currentWeek.push(
                    fillMissingDays
                      ? {
                          date: day.date.subtract({ days: dayOfWeek - i }),
                          events: [],
                          isToday: false,
                          isInCurrentPeriod: false,
                        }
                      : null,
                  )
                }
              }
            }
            currentWeek.push(day)
            if (currentWeek.length === 7) {
              weeks.push(currentWeek)
              currentWeek = []
            }
          })

          if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
              const lastDate =
                currentWeek[currentWeek.length - 1]?.date ??
                Temporal.PlainDate.from('2024-01-01')
              currentWeek.push(
                fillMissingDays
                  ? {
                      date: lastDate.add({ days: 1 }),
                      events: [],
                      isToday: false,
                      isInCurrentPeriod: false,
                    }
                  : null,
              )
            }
            weeks.push(currentWeek)
          }

          return weeks
        }
        default:
          break
      }
      return groups
    },
    [weekStartsOn],
  )

  return {
    ...state,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
    days: daysWithEvents,
    daysNames,
    changeViewMode,
    getEventProps,
    currentTimeMarkerProps,
    isPending,
    groupDaysBy,
  }
}
