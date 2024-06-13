import { useEffect, useRef, useState, useTransition } from 'react'
import { useStore } from '@tanstack/react-store'
import { Temporal } from '@js-temporal/polyfill'
import { CalendarCore, type CalendarState, type Event } from '@tanstack/time'
import type { CalendarApi, CalendarCoreOptions } from '@tanstack/time'

export const useCalendar = <TEvent extends Event>(
  options: CalendarCoreOptions<TEvent>,
): CalendarApi<TEvent> & { isPending: boolean } => {
  const [calendarCore] = useState(() => new CalendarCore<TEvent>(options))
  const state = useStore(calendarCore.store)

  const [isPending, startTransition] = useTransition()
  const currentTimeInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updateCurrentTime = () => {
      calendarCore.updateCurrentTime()
    }

    if (currentTimeInterval.current) clearTimeout(currentTimeInterval.current)

    const now = Temporal.Now.plainDateTimeISO()
    const msToNextMinute = (60 - now.second) * 1000 - now.millisecond

    currentTimeInterval.current = setTimeout(() => {
      updateCurrentTime()
      currentTimeInterval.current = setInterval(updateCurrentTime, 60000)
    }, msToNextMinute)

    return () => clearTimeout(currentTimeInterval.current)
  }, [calendarCore])

  const goToPreviousPeriod = () => {
    startTransition(() => {
      calendarCore.goToPreviousPeriod()
    })
  }

  const goToNextPeriod = () => {
    startTransition(() => {
      calendarCore.goToNextPeriod()
    })
  }

  const goToCurrentPeriod = () => {
    startTransition(() => {
      calendarCore.goToCurrentPeriod()
    })
  }

  const goToSpecificPeriod = (date: Temporal.PlainDate) => {
    startTransition(() => {
      calendarCore.goToSpecificPeriod(date)
    })
  }

  const changeViewMode = (newViewMode: CalendarState['viewMode']) => {
    startTransition(() => {
      calendarCore.changeViewMode(newViewMode)
    })
  }

  return {
    currentPeriod: state.currentPeriod,
    viewMode: state.viewMode,
    currentTime: state.currentTime,
    days: calendarCore.getDaysWithEvents(),
    daysNames: calendarCore.getDaysNames(),
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
    changeViewMode,
    getEventProps: calendarCore.getEventProps.bind(calendarCore),
    getCurrentTimeMarkerProps:
      calendarCore.getCurrentTimeMarkerProps.bind(calendarCore),
    isPending,
    groupDaysBy: calendarCore.groupDaysBy.bind(calendarCore),
  }
}
