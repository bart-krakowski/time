import { createAction } from 'typesafe-actions'
import type { ActionType } from 'typesafe-actions'
import type { Temporal } from '@js-temporal/polyfill'

const setDate = createAction('SET_DATE')<{
  date: Temporal.PlainDate
  multiple: boolean | undefined
  range: boolean | undefined
  minDate: Temporal.PlainDate | undefined
  maxDate: Temporal.PlainDate | undefined
}>()
const goToCurrentPeriod = createAction('SET_CURRENT_PERIOD')<{ minDate?: Temporal.PlainDate; maxDate?: Temporal.PlainDate }>()
const goToNextPeriod = createAction('SET_NEXT_PERIOD')()
const goToPreviousPeriod = createAction('SET_PREVIOUS_PERIOD')()
const goToSpecificPeriod = createAction(
  'SET_SPECIFIC_PERIOD',
)<Temporal.PlainDate>()

export const actions = {
  setDate,
  goToCurrentPeriod,
  goToNextPeriod,
  goToPreviousPeriod,
  goToSpecificPeriod,
}
export type UseDatePickerAction = ActionType<typeof actions>
