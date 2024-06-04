import { useReducer } from "react";
import { createReducer } from "typesafe-actions";
import { Temporal } from "@js-temporal/polyfill";
import { type UseDatePickerAction, actions } from "./useDatePickerActions";
import type { DatePickerState } from "./useDatePickerState";

const createDatePickerReducer = (initialState: DatePickerState) => 
  createReducer<DatePickerState, UseDatePickerAction>(initialState)
    .handleAction(actions.setDate, (state, action) => ({
      ...state,
      selectedDate: action.payload,
    }))
    .handleAction(actions.setCurrentPeriod, (state, action) => {
      if (
        (state.minDate && Temporal.PlainDate.compare(action.payload, state.minDate) < 0) ||
        (state.maxDate && Temporal.PlainDate.compare(action.payload, state.maxDate) > 0)
      ) {
        return state;
      }

      return {
        ...state,
        currPeriod: action.payload,
      };
    });

export const useDatePickerReducer = <TState extends DatePickerState = DatePickerState>(
  initialState: TState
) => {
  const reducer = createDatePickerReducer(initialState);
  return useReducer(reducer, initialState);
}