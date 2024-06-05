import { createAction } from 'typesafe-actions';
import type { Temporal } from '@js-temporal/polyfill';
import type { ActionType } from 'typesafe-actions';

const setViewMode = createAction('SET_VIEW_MODE')<'month' | 'week' | number>();
const updateCurrentTime = createAction('UPDATE_CURRENT_TIME')<Temporal.PlainDateTime>();
const setCurrentPeriod = createAction('SET_CURRENT_PERIOD')<Temporal.PlainDate>();
const setNextPeriod = createAction('SET_NEXT_PERIOD')();
const setPreviousPeriod = createAction('SET_PREVIOUS_PERIOD')();

export const actions = { setCurrentPeriod, setViewMode, updateCurrentTime, setNextPeriod, setPreviousPeriod };
export type UseCalendarAction = ActionType<typeof actions>;
