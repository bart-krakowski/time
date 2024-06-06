import { useMemo, useReducer } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { createReducer } from "typesafe-actions";

import { type UseDatePickerAction, actions } from "./useDatePickerActions";
import type { UseDatePickerState } from "./useDatePickerState";

const createDatePickerReducer = (initialState: UseDatePickerState) =>
  createReducer<UseDatePickerState, UseDatePickerAction>(initialState)
    .handleAction(actions.setDate, (state, action) => {
      const { date: selectedDate, multiple, range, minDate, maxDate } = action.payload;

      if (
        (minDate &&
          Temporal.PlainDate.compare(selectedDate, minDate) < 0) ??
        (maxDate &&
          Temporal.PlainDate.compare(selectedDate, maxDate) > 0)
      ) {
        return state;
      }

      if (multiple) {
        const selectedDates = new Map(state.selectedDates);
        const dateKey = selectedDate.toString();
        if (selectedDates.has(dateKey)) {
          selectedDates.delete(dateKey);
        } else {
          selectedDates.set(dateKey, selectedDate);
        }
        return {
          ...state,
          selectedDates,
        };
      }

      if (range) {
        const selectedDates = new Map(state.selectedDates);

        if (selectedDates.size === 0 || selectedDates.size === 2) {
          return {
            ...state,
            selectedDates: new Map([[selectedDate.toString(), selectedDate]]),
          };
        } else if (selectedDates.size === 1) {
          const [startDate] = selectedDates.values();
          if (startDate) {
            const newDates = [startDate, selectedDate].sort((a, b) =>
              Temporal.PlainDate.compare(a, b)
            );
            return {
              ...state,
              selectedDates: new Map(newDates.map(date => [date.toString(), date])),
            };
          } else {
            return {
              ...state,
              selectedDates: new Map([[selectedDate.toString(), selectedDate]]),
            };
          }
        }
      }

      const selectedDates = new Map(state.selectedDates);
      const dateKey = selectedDate.toString();
      if (selectedDates.has(dateKey)) {
        selectedDates.delete(dateKey);
      } else {
        selectedDates.clear();
        selectedDates.set(dateKey, selectedDate);
      }

      return {
        ...state,
        selectedDates,
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
