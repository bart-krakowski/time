import { useCallback, useEffect, useMemo, useRef, useTransition } from 'react'
import { Temporal } from '@js-temporal/polyfill'

import { generateDateRange, getEventProps, getFirstDayOfMonth, getFirstDayOfWeek, groupDaysBy, splitMultiDayEvents } from '@tanstack/time'
import { actions } from './calendarActions'
import { useCalendarReducer } from './useCalendarReducer'
import type { CalendarState, Event, GroupDaysByProps} from '@tanstack/time';
import type { UseCalendarAction } from './calendarActions'
import type { CSSProperties } from 'react'



interface UseCalendarProps<
  TEvent extends Event,
  TState extends CalendarState = CalendarState,
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
 * @returns {'month' | 'week' | number} calendarState.viewMode - The current view mode of the calendar.
 * @returns {Function} goToPreviousPeriod - Function to navigate to the previous period.
 * @returns {Function} goToNextPeriod - Function to navigate to the next period.
 * @returns {Function} goToCurrentPeriod - Function to navigate to the current period.
 * @returns {Function} goToSpecificPeriod - Function to navigate to a specific period.
 * @returns {Array<Array<{ date: Temporal.PlainDate; events: TEvent[]; isToday: boolean; isInCurrentPeriod: boolean }>>} days - The calendar grid, where each cell contains the date and events for that day.
 * @returns {string[]} daysNames - An array of day names based on the locale and week start day.
 * @returns {Function} changeViewMode - Function to change the view mode of the calendar.
 * @returns {Function} getEventProps - Function to retrieve the style properties for a specific event based on its ID.
 * @returns {Function} currentTimeMarkerProps - Function to retrieve the style properties and current time for the current time marker.
 */
export const useCalendar = <
  TEvent extends Event,
  TState extends CalendarState = CalendarState,
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
  const currentTimeInterval = useRef<NodeJS.Timeout>()
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
        const splitEvents = splitMultiDayEvents<TEvent>(event)
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

  const getEventPropsCallback = useCallback(
    (id: Event['id']): { style: CSSProperties } | null => getEventProps(eventMap, id, state),
    [eventMap, state],
  )

  const updateCurrentTime = useCallback(() => dispatch(actions.updateCurrentTime(Temporal.Now.plainDateTimeISO())), [dispatch])

  useEffect(() => {
    if (currentTimeInterval.current) clearTimeout(currentTimeInterval.current);

    const now = Temporal.Now.plainDateTimeISO();
    const msToNextMinute = (60 - now.second) * 1000 - now.millisecond;

    currentTimeInterval.current = setTimeout(() => {
      updateCurrentTime();
      currentTimeInterval.current = setInterval(updateCurrentTime, 60000);
    }, msToNextMinute);

    return () => clearTimeout(currentTimeInterval.current);
  }, [dispatch, updateCurrentTime]);
  

  const getCurrentTimeMarkerProps = useCallback(() => {
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

  const groupDaysByCallback = useCallback(
    ({
      days,
      unit,
      fillMissingDays = true,
    }: Omit<GroupDaysByProps<TEvent>, 'weekStartsOn'>) => groupDaysBy({ days, unit, fillMissingDays, weekStartsOn } as GroupDaysByProps<TEvent>),
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
    getEventProps: getEventPropsCallback,
    getCurrentTimeMarkerProps,
    isPending,
    groupDaysBy: groupDaysByCallback,
  }
}
