import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useStore } from '@tanstack/react-store'
import { Temporal } from '@js-temporal/polyfill'
import { CalendarCore, type CalendarState, type Event } from '@tanstack/time'
import type { CalendarApi, CalendarCoreOptions, GroupDaysByProps } from '@tanstack/time'

export const useCalendar = <TEvent extends Event>(
  options: CalendarCoreOptions<TEvent>,
): CalendarApi<TEvent> & { isPending: boolean } => {
  const [calendarCore] = useState(() => new CalendarCore<TEvent>(options))
  const state = useStore(calendarCore.store)
  const [isPending, startTransition] = useTransition()
  const currentTimeInterval = useRef<NodeJS.Timeout>()

  const updateCurrentTime = useCallback(() => {
    calendarCore.updateCurrentTime()
  }, [calendarCore])

  useEffect(() => {
    if (currentTimeInterval.current) clearTimeout(currentTimeInterval.current)

    const now = Temporal.Now.plainDateTimeISO()
    const msToNextMinute = (60 - now.second) * 1000 - now.millisecond

    currentTimeInterval.current = setTimeout(() => {
      updateCurrentTime()
      currentTimeInterval.current = setInterval(updateCurrentTime, 60000)
    }, msToNextMinute)

    return () => clearTimeout(currentTimeInterval.current)
  }, [calendarCore, updateCurrentTime])

  const goToPreviousPeriod = useCallback(() => {
    startTransition(() => {
      calendarCore.goToPreviousPeriod()
    })
  }, [calendarCore, startTransition])

  const goToNextPeriod = useCallback(() => {
    startTransition(() => {
      calendarCore.goToNextPeriod()
    })
  }, [calendarCore, startTransition])

  const goToCurrentPeriod = useCallback(() => {
    startTransition(() => {
      calendarCore.goToCurrentPeriod()
    })
  }, [calendarCore, startTransition])

  const goToSpecificPeriod = useCallback((date: Temporal.PlainDate) => {
    startTransition(() => {
      calendarCore.goToSpecificPeriod(date)
    })
  }, [calendarCore, startTransition])

  const changeViewMode = useCallback((newViewMode: CalendarState['viewMode']) => {
    startTransition(() => {
      calendarCore.changeViewMode(newViewMode)
    })
  }, [calendarCore, startTransition])

  const getEventProps = useCallback((id: TEvent['id']) => calendarCore.getEventProps(id), [calendarCore])

  const getCurrentTimeMarkerProps = useCallback(() => calendarCore.getCurrentTimeMarkerProps(), [calendarCore])

  const groupDaysBy = useCallback((props: Omit<GroupDaysByProps<TEvent>, "weekStartsOn">) => calendarCore.groupDaysBy(props), [calendarCore])

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
    getEventProps,
    getCurrentTimeMarkerProps,
    isPending,
    groupDaysBy,
  }
}
