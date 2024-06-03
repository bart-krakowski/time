import { useReducer } from 'react';
import { createReducer } from 'typesafe-actions';

import { setCurrentPeriod, setViewMode, updateCurrentTime } from './calendarActions';
import type { CalendarAction} from './calendarActions';
import type { CalendarState} from './useCalendarState';

const createCalendarReducer = (initialState: CalendarState) => {
  return createReducer<CalendarState, CalendarAction>(initialState)
    .handleAction(setCurrentPeriod, (state, action) => ({
      ...state,
      currPeriod: action.payload,
    }))
    .handleAction(setViewMode, (state, action) => ({
      ...state,
      viewMode: action.payload,
    }))
    .handleAction(updateCurrentTime, (state, action) => ({
      ...state,
      currentTime: action.payload,
    }));
}

export const useCalendarReducer = <TState extends CalendarState = CalendarState>(
  initialState: TState,
) => {
  const reducer = createCalendarReducer(initialState);
  return useReducer(reducer, initialState);
}
