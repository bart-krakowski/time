import { createAction } from 'typesafe-actions';
import type { Temporal } from '@js-temporal/polyfill';
import type { ActionType } from 'typesafe-actions';

export const setCurrentPeriod = createAction('SET_CURRENT_PERIOD')<Temporal.PlainDate>();
export const setViewMode = createAction('SET_VIEW_MODE')<'month' | 'week' | number>();
export const updateCurrentTime = createAction('UPDATE_CURRENT_TIME')<Temporal.PlainDateTime>();

const actions = { setCurrentPeriod, setViewMode, updateCurrentTime };
export type CalendarAction = ActionType<typeof actions>;
