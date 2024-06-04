import { useReducer } from 'react'
import { createReducer } from 'typesafe-actions'
import { Temporal } from '@js-temporal/polyfill'
import { type UseDatePickerAction, actions } from './useDatePickerActions'
import type { DatePickerState } from './useDatePickerState'

const createDatePickerReducer = (initialState: DatePickerState) =>
  createReducer<DatePickerState, UseDatePickerAction>(initialState)
    .handleAction(actions.setDate, (state, action) => {
      if (
        (state.minDate &&
          Temporal.PlainDate.compare(action.payload, state.minDate) < 0) ||
        (state.maxDate &&
          Temporal.PlainDate.compare(action.payload, state.maxDate) > 0)
      )
        return state

      return {
        ...state,
        selectedDate: action.payload,
      }
    })
    .handleAction(actions.setCurrentPeriod, (state) => {
      const now = Temporal.Now.plainDateISO()
      if (
        (state.minDate && Temporal.PlainDate.compare(now, state.minDate) < 0) ||
        (state.maxDate && Temporal.PlainDate.compare(now, state.maxDate) > 0)
      ) {
        return state
      }

      return {
        ...state,
        currPeriod: now,
      }
    })
    .handleAction(actions.setNextPeriod, (state) => ({
      ...state,
      currPeriod: state.currPeriod.add({ months: 1 }),
    }))
    .handleAction(actions.setPreviousPeriod, (state) => ({
      ...state,
      currPeriod: state.currPeriod.subtract({ months: 1 }),
    }))

export const useDatePickerReducer = (initialState: DatePickerState) => {
  const reducer = createDatePickerReducer(initialState)
  return useReducer(reducer, initialState)
}
