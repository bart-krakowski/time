import { useMemo, useReducer } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { createReducer } from "typesafe-actions";

import { type UseDatePickerAction, actions } from "./useDatePickerActions";
import type { UseDatePickerState } from "./useDatePickerState";


const createDatePickerReducer = (initialState: UseDatePickerState) =>
  createReducer<UseDatePickerState, UseDatePickerAction>(initialState)
    .handleAction(actions.setDate, (state, action) => {
      const { date: selectedDate, multiple, range, minDate, maxDate } = action.payload

      if (
        (minDate &&
          Temporal.PlainDate.compare(selectedDate, minDate) < 0) ??
        (maxDate &&
          Temporal.PlainDate.compare(selectedDate, maxDate) > 0)
      ) {
        return state;
      }

      if (multiple) {
        const selectedDates = state.selectedDates ?? [];
        const dateIndex = selectedDates.findIndex((date) =>
          Temporal.PlainDate.compare(date, selectedDate) === 0
        );

        if (dateIndex > -1) {
          return {
            ...state,
            selectedDates: [
              ...selectedDates.slice(0, dateIndex),
              ...selectedDates.slice(dateIndex + 1),
            ],
          };
        } else {
          return {
            ...state,
            selectedDates: [...selectedDates, selectedDate],
          };
        }
      }

      if (range) {
        const selectedDates = state.selectedDates ?? [];

        if (selectedDates.length === 0 || selectedDates.length === 2) {
          return {
            ...state,
            selectedDates: [selectedDate],
          };
        } else if (selectedDates.length === 1) {
          const startDate = selectedDates[0];

          if (startDate) {
            return {
              ...state,
              selectedDates: [startDate, selectedDate].sort((a, b) =>
                Temporal.PlainDate.compare(a, b)
              ),
            };
          } else {
            return {
              ...state,
              selectedDates: [selectedDate],
            };
          }
        }
      }

      return {
        ...state,
        selectedDate,
      };
    })
    .handleAction(actions.goToCurrentPeriod, (state, action) => {
      const { minDate, maxDate } = action.payload;
      const now = Temporal.Now.plainDateISO();
      if (
        (minDate && Temporal.PlainDate.compare(now, minDate) < 0) ??
        (maxDate && Temporal.PlainDate.compare(now, maxDate) > 0)
      ) {
        return state;
      }

      return {
        ...state,
        currPeriod: now,
      };
    })
    .handleAction(actions.goToNextPeriod, (state) => ({
      ...state,
      currPeriod: state.currPeriod.add({ months: 1 }),
    }))
    .handleAction(actions.goToPreviousPeriod, (state) => ({
      ...state,
      currPeriod: state.currPeriod.subtract({ months: 1 }),
    }));

export const useDatePickerReducer = <TState extends UseDatePickerState = UseDatePickerState>(
  initialState: TState,
  extReducer?: (state: TState, action: UseDatePickerAction) => TState
) => {
  const reducer = useMemo(() => extReducer ?? createDatePickerReducer(initialState), [extReducer, initialState]);
  return useReducer(reducer, initialState);
};
