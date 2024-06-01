import { useCallback, useMemo, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import type { CSSProperties, MouseEventHandler } from 'react'

export interface Event {
  id: string
  startDate: Temporal.PlainDateTime
  endDate: Temporal.PlainDateTime
  title: string
}

const getFirstDayOfMonth = (currMonth: string) =>
  Temporal.PlainDate.from(`${currMonth}-01`)

const getFirstDayOfWeek = (currWeek: string, weekStartsOn: number) => {
  const date = Temporal.PlainDate.from(currWeek)
  return date.subtract({ days: (date.dayOfWeek - weekStartsOn + 7) % 7 })
}

const getChunks = function* <T>(arr: T[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

const splitMultiDayEvents = (event: Event) => {
  const startDate = Temporal.PlainDateTime.from(event.startDate)
  const endDate = Temporal.PlainDateTime.from(event.endDate)
  const events: Event[] = []

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

interface UseCalendarProps {
  weekStartsOn?: number
  events: Event[]
  viewMode: 'month' | 'week' | number
  locale?: string
  onChangeViewMode?: (viewMode: 'month' | 'week' | number) => void
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

export const useCalendar = ({
  weekStartsOn = 1,
  events,
  viewMode: initialViewMode,
  locale,
  onChangeViewMode,
}: UseCalendarProps) => {
  const today = Temporal.Now.plainDateISO()

  const [currPeriod, setCurrPeriod] = useState(today)
  const [viewMode, setViewMode] = useState(initialViewMode)

  const firstDayOfMonth = getFirstDayOfMonth(
    currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
  )
  const firstDayOfWeek = getFirstDayOfWeek(currPeriod.toString(), weekStartsOn)

  const days =
    viewMode === 'month'
      ? Array.from(
          getChunks(
            generateDateRange(
              firstDayOfMonth,
              firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 }),
            ),
            7,
          ),
        )
      : viewMode === 'week'
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
                currPeriod,
                currPeriod.add({ days: viewMode - 1 }),
              ),
              viewMode,
            ),
          )

  const eventMap = useMemo(() => {
    const map = new Map<string, Event[]>()

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
          if (splitKey && !map.has(splitKey)) {
            map.set(splitKey, [])
            map.get(splitKey)?.push(splitEvent)
          }
        })
      } else {
        const eventKey = event.startDate.toString().split('T')[0]
        if (eventKey && !map.has(eventKey)) {
          map.set(eventKey, [])
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

  const getPrev = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    switch (viewMode) {
      case 'month': {
        const firstDayOfPrevMonth = firstDayOfMonth.subtract({ months: 1 })
        setCurrPeriod(firstDayOfPrevMonth)
        break
      }
      case 'week': {
        const firstDayOfPrevWeek = firstDayOfWeek.subtract({ weeks: 1 })
        setCurrPeriod(firstDayOfPrevWeek)
        break
      }
      default: {
        const prevCustomStart = currPeriod.subtract({ days: viewMode })
        setCurrPeriod(prevCustomStart)
        break
      }
    }
  }, [viewMode, firstDayOfMonth, firstDayOfWeek, currPeriod])

  const getNext = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    switch (viewMode) {
      case 'month': {
        const firstDayOfNextMonth = firstDayOfMonth.add({ months: 1 })
        setCurrPeriod(firstDayOfNextMonth)
        break
      }
      case 'week': {
        const firstDayOfNextWeek = firstDayOfWeek.add({ weeks: 1 })
        setCurrPeriod(firstDayOfNextWeek)
        break
      }
      default: {
        const nextCustomStart = currPeriod.add({ days: viewMode })
        setCurrPeriod(nextCustomStart)
        break
      }
    }
  }, [viewMode, firstDayOfMonth, firstDayOfWeek, currPeriod])

  const getCurrent = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setCurrPeriod(today)
  }, [today])

  const get = useCallback((date: Temporal.PlainDate) => {
    setCurrPeriod(date)
  }, [])

  const chunks =
    viewMode === 'month' ? [...getChunks(daysWithEvents, 7)] : [daysWithEvents]
  const changeViewMode = useCallback(
    (newViewMode: 'month' | 'week' | number) => {
      onChangeViewMode?.(newViewMode)
      setViewMode(newViewMode)
    },
    [onChangeViewMode],
  )

  const getEventProps = useCallback(
    (id: Event['id']): { style: CSSProperties } | null => {
      const event = [...eventMap.values()]
        .flat()
        .find((event) => event.id === id)
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

      if (viewMode === 'week' || typeof viewMode === 'number') {
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
    [eventMap, viewMode],
  )

  return {
    firstDayOfPeriod:
      viewMode === 'month'
        ? firstDayOfMonth
        : viewMode === 'week'
          ? firstDayOfWeek
          : currPeriod,
    currPeriod: currPeriod.toString({ calendarName: 'auto' }),
    getPrev,
    getNext,
    getCurrent,
    get,
    chunks,
    daysNames: days
      .flat()
      .map((day) => day.toLocaleString(locale, { weekday: 'short' })),
    viewMode,
    changeViewMode,
    getEventProps,
  }
}
