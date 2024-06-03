import { useReducer } from "react";
import { createReducer } from "typesafe-actions";
import { type UseDatePickerAction, actions } from "./useDatePickerActions";
import type { DatePickerState } from "./useDatePickerState";

const createDatePickerReducer = (initialState: DatePickerState) => 
  createReducer<DatePickerState, UseDatePickerAction>(initialState)
    .handleAction(actions.setDate, (state, action) => ({
      ...state,
      selectedDate: action.payload,
    }))
    .handleAction(actions.setCurrentPeriod, (state, action) => ({
      ...state,
      currPeriod: action.payload,
    }));

export const useDatePickerReducer = <TState extends DatePickerState = DatePickerState>(
  initialState: TState
) => {
  const reducer = createDatePickerReducer(initialState);
  return useReducer(reducer, initialState);
}