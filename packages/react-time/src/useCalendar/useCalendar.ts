import { useCallback, useState, useTransition } from 'react'
import { useStore } from '@tanstack/react-store'
import { CalendarCore, type Event } from '@tanstack/time'
import type { CalendarApi, CalendarCoreOptions } from '@tanstack/time'

export const useCalendar = <TEvent extends Event>(
  options: CalendarCoreOptions<TEvent>,
): CalendarApi<TEvent> & { isPending: boolean } => {
  const [calendarCore] = useState(() => new CalendarCore<TEvent>(options))
  const state = useStore(calendarCore.store)
  const [isPending, startTransition] = useTransition()

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
    isPending,
    groupDaysBy,
  }
}
