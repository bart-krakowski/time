import { createAction } from "typesafe-actions";
import type { ActionType} from "typesafe-actions";
import type { Temporal } from "@js-temporal/polyfill";

const setDate = createAction('SET_DATE')<Temporal.PlainDate>();
const goToCurrentPeriod = createAction('SET_CURRENT_PERIOD')();
const goToNextPeriod = createAction('SET_NEXT_PERIOD')()
const goToPreviousPeriod = createAction('SET_PREVIOUS_PERIOD')()

export const actions = { setDate, goToCurrentPeriod, goToNextPeriod, goToPreviousPeriod };
export type UseDatePickerAction = ActionType<typeof actions>;
