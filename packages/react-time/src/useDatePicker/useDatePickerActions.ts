import { createAction } from "typesafe-actions";
import type { ActionType} from "typesafe-actions";
import type { Temporal } from "@js-temporal/polyfill";

const setDate = createAction('SET_DATE')<Temporal.PlainDate>();
const setCurrentPeriod = createAction('SET_CURRENT_PERIOD')();
const setNextPeriod = createAction('SET_NEXT_PERIOD')()
const setPreviousPeriod = createAction('SET_PREVIOUS_PERIOD')()

export const actions = { setDate, setCurrentPeriod, setNextPeriod, setPreviousPeriod };
export type UseDatePickerAction = ActionType<typeof actions>;
