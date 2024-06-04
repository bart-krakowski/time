import { useCallback, useEffect, useMemo } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { getFirstDayOfMonth, getFirstDayOfWeek } from "@tanstack/time";
import { actions } from './calendarActions'
import { useCalendarReducer } from './useCalendarReducer'
import type { Event } from './useCalendarState'
import type { CSSProperties, MouseEventHandler } from 'react'

interface UseCalendarProps<TEvent extends Event> {
  weekStartsOn?: number
  events: TEvent[]
  viewMode: 'month' | 'week' | number
  locale?: Parameters<Temporal.PlainDate['toLocaleString']>['0']
  onChangeViewMode?: (viewMode: 'month' | 'week' | number) => void
}

const getChunks = function* <T>(arr: T[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
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

    events.push({
      ...event,
      startDate: eventStart,
      endDate: eventEnd,
    })

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

export const useCalendar = <TEvent extends Event>({
  weekStartsOn = 1,
  events,
  viewMode: initialViewMode,
  locale,
  onChangeViewMode,
}: UseCalendarProps<TEvent>) => {
  const today = Temporal.Now.plainDateISO()
  const [state, dispatch] = useCalendarReducer({
    currPeriod: today,
    viewMode: initialViewMode,
    currentTime: Temporal.Now.plainDateTimeISO(),
    weekStartsOn,
  })
  
  const firstDayOfMonth = getFirstDayOfMonth(
    state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
  )

  const firstDayOfWeek = getFirstDayOfWeek(
    state.currPeriod.toString(),
    state.weekStartsOn,
  )

  const days =
    state.viewMode === 'month'
      ? Array.from(
          getChunks(
            generateDateRange(
              firstDayOfMonth,
              firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 }),
            ),
            7,
          ),
        )
      : state.viewMode === 'week'
        ? Array.from(
            getChunks(
              generateDateRange(
                firstDayOfWeek,
                firstDayOfWeek.add({ days: 6 }),
              ),
              7,
            ),
          )
        : Array.from(
            getChunks(
              generateDateRange(
                state.currPeriod,
                state.currPeriod.add({ days: state.viewMode - 1 }),
              ),
              state.viewMode,
            ),
          )

  const eventMap = useMemo(() => {
    const map = new Map<string, TEvent[]>()

    events.forEach((event) => {
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

  const daysWithEvents = days.map((dayChunk) => {
    return dayChunk.map((day) => {
      const dayKey = day.toString()
      const dailyEvents = eventMap.get(dayKey) ?? []

      return {
        date: day,
        events: dailyEvents,
      }
    })
  })

  const setPreviousPeriod = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    dispatch(actions.setPreviousPeriod)
  }, [dispatch])

  const setNextPeriod = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    dispatch(actions.setNextPeriodPeriod)
  }, [dispatch])

  const getCurrentPeriod = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    dispatch(actions.setCurrentPeriod(Temporal.Now.plainDateISO()))
  }, [dispatch])

  const get = useCallback(
    (date: Temporal.PlainDate) => {
      dispatch(actions.setCurrentPeriod(date))
    },
    [dispatch],
  )

  const chunks =
    state.viewMode === 'month'
      ? [...getChunks(daysWithEvents, 7)]
      : [daysWithEvents]

  const changeViewMode = useCallback(
    (newViewMode: 'month' | 'week' | number) => {
      dispatch(actions.setViewMode(newViewMode))
      onChangeViewMode?.(newViewMode)
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

      if (state.viewMode === 'week' || typeof state.viewMode === 'number') {
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
    const intervalId = setInterval(() => {
      dispatch(updateCurrentTime(Temporal.Now.plainDateTimeISO()))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [dispatch])

  const getCurrentPeriodTimeMarkerProps = useCallback(() => {
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

  return {
    firstDayOfPeriod:
      state.viewMode === 'month'
        ? firstDayOfMonth
        : state.viewMode === 'week'
          ? firstDayOfWeek
          : state.currPeriod,
    currPeriod: state.currPeriod.toString({ calendarName: 'auto' }),
    setPreviousPeriod,
    setNextPeriod,
    getCurrentPeriod,
    get,
    chunks,
    daysNames: days
      .flat()
      .map((day) => day.toLocaleString(locale, { weekday: 'short' })),
    viewMode: state.viewMode,
    changeViewMode,
    getEventProps,
    getCurrentPeriodTimeMarkerProps,
  }
}
