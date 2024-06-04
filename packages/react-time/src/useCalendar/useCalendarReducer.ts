import { useReducer } from 'react'
import { createReducer } from 'typesafe-actions'

import { getFirstDayOfMonth, getFirstDayOfWeek } from '@tanstack/time'
import { type CalendarAction, actions } from './calendarActions'
import type { CalendarState } from './useCalendarState'

const createCalendarReducer = (initialState: CalendarState) => {
  return createReducer<CalendarState, CalendarAction>(initialState)
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
    .handleAction(actions.setPreviousPeriod, (state) => {
      const firstDayOfMonth = getFirstDayOfMonth(
        state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
      )
      const firstDayOfWeek = getFirstDayOfWeek(
        state.currPeriod.toString(),
        state.weekStartsOn,
      )

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
          const prevCustomStart = state.currPeriod.subtract({
            days: state.viewMode,
          })
          return {
            ...state,
            currPeriod: prevCustomStart,
          }
        }
      }
    })
    .handleAction(actions.setNextPeriodPeriod, (state, action) => {
      const firstDayOfMonth = getFirstDayOfMonth(
        state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
      )
      const firstDayOfWeek = getFirstDayOfWeek(
        state.currPeriod.toString(),
        state.weekStartsOn,
      )

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

export const useCalendarReducer = <
  TState extends CalendarState = CalendarState,
>(
  initialState: TState,
) => {
  const reducer = createCalendarReducer(initialState)
  return useReducer(reducer, initialState)
}
