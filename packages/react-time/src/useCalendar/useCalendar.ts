import { useCallback, useRef, useState, useTransition } from 'react'
import { useStore } from '@tanstack/react-store'
import { Temporal } from '@js-temporal/polyfill'
import { CalendarCore, type Event } from '@tanstack/time'
import { useIsomorphicLayoutEffect } from '../utils'
import type { CalendarApi, CalendarCoreOptions } from '@tanstack/time'

export const useCalendar = <TEvent extends Event>(
  options: CalendarCoreOptions<TEvent>,
): CalendarApi<TEvent> & { isPending: boolean } => {
  const [calendarCore] = useState(() => new CalendarCore<TEvent>(options))
  const state = useStore(calendarCore.store)
  const [isPending, startTransition] = useTransition()
  const currentTimeInterval = useRef<NodeJS.Timeout>()

  const updateCurrentTime = useCallback<typeof calendarCore.updateCurrentTime>(() => {
    calendarCore.updateCurrentTime()
  }, [calendarCore])

  useIsomorphicLayoutEffect(() => {
    if (currentTimeInterval.current) clearTimeout(currentTimeInterval.current)

    const now = Temporal.Now.plainDateTimeISO()
    const msToNextMinute = (60 - now.second) * 1000 - now.millisecond

    currentTimeInterval.current = setTimeout(() => {
      updateCurrentTime()
      currentTimeInterval.current = setInterval(updateCurrentTime, 60000)
    }, msToNextMinute)

    return () => clearTimeout(currentTimeInterval.current)
  }, [calendarCore, updateCurrentTime])

  const goToPreviousPeriod = useCallback<typeof calendarCore.goToPreviousPeriod>(() => {
    startTransition(() => {
      calendarCore.goToPreviousPeriod()
    })
  }, [calendarCore, startTransition])

  const goToNextPeriod = useCallback<typeof calendarCore.goToNextPeriod>(() => {
    startTransition(() => {
      calendarCore.goToNextPeriod()
    })
  }, [calendarCore, startTransition])

  const goToCurrentPeriod = useCallback<typeof calendarCore.goToCurrentPeriod>(() => {
    startTransition(() => {
      calendarCore.goToCurrentPeriod()
    })
  }, [calendarCore, startTransition])

  const goToSpecificPeriod = useCallback<typeof calendarCore.goToSpecificPeriod>((date) => {
    startTransition(() => {
      calendarCore.goToSpecificPeriod(date)
    })
  }, [calendarCore, startTransition])

  const changeViewMode = useCallback<typeof calendarCore.changeViewMode>((newViewMode) => {
    startTransition(() => {
      calendarCore.changeViewMode(newViewMode)
    })
  }, [calendarCore, startTransition])

  const getEventProps = useCallback<typeof calendarCore.getEventProps>((id) => calendarCore.getEventProps(id), [calendarCore])

  const getCurrentTimeMarkerProps = useCallback<typeof calendarCore.getCurrentTimeMarkerProps>(() => calendarCore.getCurrentTimeMarkerProps(), [calendarCore])

  const groupDaysBy = useCallback<typeof calendarCore.groupDaysBy>((props) => calendarCore.groupDaysBy(props), [calendarCore])

  return {
    ...state,
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
