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
      const firstDayOfMonth = getFirstDayOfMonth(state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7));
      const firstDayOfWeek = getFirstDayOfWeek(state.currPeriod.toString(), action.payload.weekStartsOn);

      switch (state.viewMode.unit) {
        case 'months': {
          const firstDayOfPrevMonth = firstDayOfMonth.subtract({ months: state.viewMode.value });
          return {
            ...state,
            currPeriod: firstDayOfPrevMonth,
          };
        }
        case 'weeks': {
          const firstDayOfPrevWeek = firstDayOfWeek.subtract({ weeks: state.viewMode.value });
          return {
            ...state,
            currPeriod: firstDayOfPrevWeek,
          };
        }
        case 'days': {
          const prevCustomStart = state.currPeriod.subtract({ days: state.viewMode.value });
          return {
            ...state,
            currPeriod: prevCustomStart,
          };
        }
        default:
          return state;
      }
    })
    .handleAction(actions.goToNextPeriod, (state, action) => {
      const firstDayOfMonth = getFirstDayOfMonth(state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7));
      const firstDayOfWeek = getFirstDayOfWeek(state.currPeriod.toString(), action.payload.weekStartsOn);

      switch (state.viewMode.unit) {
        case 'months': {
          const firstDayOfNextMonth = firstDayOfMonth.add({ months: state.viewMode.value });
          return {
            ...state,
            currPeriod: firstDayOfNextMonth,
          };
        }
        case 'weeks': {
          const firstDayOfNextWeek = firstDayOfWeek.add({ weeks: state.viewMode.value });
          return {
            ...state,
            currPeriod: firstDayOfNextWeek,
          };
        }
        case 'days': {
          const nextCustomStart = state.currPeriod.add({ days: state.viewMode.value });
          return {
            ...state,
            currPeriod: nextCustomStart,
          };
        }
        default:
          return state;
      }
    });
};

export const useCalendarReducer = <TState extends UseCalendarState = UseCalendarState>(
  initialState: TState,
  extReducer?: (state: TState, action: UseCalendarAction) => TState,
) => {
  const reducer = useMemo(() => extReducer ?? createCalendarReducer(initialState), [extReducer, initialState])
  return useReducer(reducer, initialState)
}
