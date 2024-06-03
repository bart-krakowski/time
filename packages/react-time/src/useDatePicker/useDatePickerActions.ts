import { createAction } from "typesafe-actions";
import type { ActionType} from "typesafe-actions";
import type { Temporal } from "@js-temporal/polyfill";

const setDate = createAction('SET_DATE')<Temporal.PlainDate>();
const setCurrentPeriod = createAction('SET_CURRENT_PERIOD')<Temporal.PlainDate>();

export const actions = { setDate, setCurrentPeriod };
export type UseDatePickerAction = ActionType<typeof actions>;
