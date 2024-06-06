import { useMemo, useReducer } from 'react'
import { createReducer } from 'typesafe-actions'

import { getFirstDayOfMonth, getFirstDayOfWeek } from '@tanstack/time'
import { type UseCalendarAction, actions } from './calendarActions'
import type { UseCalendarState } from './useCalendarState'

const createCalendarReducer = (initialState: UseCalendarState) => {
  return createReducer<UseCalendarState, UseCalendarAction>(initialState)
    .handleAction(actions.setCurrentPeriod, (state, action) => ({
      ...state,
      currPeriod: action.payload,
    }))
    .handleAction(actions.setViewMode, (state, action) => ({
      ...state,
      viewMode: action.payload,
    }))
    .handleAction(actions.updateCurrentTime, (state, action) => ({
      ...state,
      currentTime: action.payload,
    }))
    .handleAction(actions.goToPreviousPeriod, (state, action) => {
      const firstDayOfMonth = getFirstDayOfMonth(state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7))
      const firstDayOfWeek = getFirstDayOfWeek(state.currPeriod.toString(), action.payload.weekStartsOn)

      switch (state.viewMode) {
        case 'month': {
          const firstDayOfPrevMonth = firstDayOfMonth.subtract({ months: 1 })
          return {
            ...state,
            currPeriod: firstDayOfPrevMonth,
          }
        }
        case 'week': {
          const firstDayOfPrevWeek = firstDayOfWeek.subtract({ weeks: 1 })
          return {
            ...state,
            currPeriod: firstDayOfPrevWeek,
          }
        }
        default: {
          const prevCustomStart = state.currPeriod.subtract({ days: state.viewMode })
          return {
            ...state,
            currPeriod: prevCustomStart,
          }
        }
      }
    })
    .handleAction(actions.goToNextPeriod, (state, action) => {
      const firstDayOfMonth = getFirstDayOfMonth(state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7))
      const firstDayOfWeek = getFirstDayOfWeek(state.currPeriod.toString(), action.payload.weekStartsOn)

      switch (state.viewMode) {
        case 'month': {
          const firstDayOfNextMonth = firstDayOfMonth.add({ months: 1 })
          return {
            ...state,
            currPeriod: firstDayOfNextMonth,
          }
        }
        case 'week': {
          const firstDayOfNextWeek = firstDayOfWeek.add({ weeks: 1 })
          return {
            ...state,
            currPeriod: firstDayOfNextWeek,
          }
        }
        default: {
          const nextCustomStart = state.currPeriod.add({ days: state.viewMode })
          return {
            ...state,
            currPeriod: nextCustomStart,
          }
        }
      }
    })
}

export const useCalendarReducer = <TState extends UseCalendarState = UseCalendarState>(
  initialState: TState,
  extReducer?: (state: TState, action: UseCalendarAction) => TState,
) => {
  const reducer = useMemo(() => extReducer ?? createCalendarReducer(initialState), [extReducer, initialState])
  return useReducer(reducer, initialState)
}
