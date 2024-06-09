import { createAction } from 'typesafe-actions';
import type { Temporal } from '@js-temporal/polyfill';
import type { ActionType } from 'typesafe-actions';
import type { UseCalendarState } from './useCalendarState';

const setViewMode = createAction('SET_VIEW_MODE')<UseCalendarState['viewMode']>();
const updateCurrentTime = createAction('UPDATE_CURRENT_TIME')<Temporal.PlainDateTime>();
const setCurrentPeriod = createAction('SET_CURRENT_PERIOD')<Temporal.PlainDate>();
const goToNextPeriod = createAction('SET_NEXT_PERIOD')<{ weekStartsOn: number }>();
const goToPreviousPeriod = createAction('SET_PREVIOUS_PERIOD')<{ weekStartsOn: number }>();

export const actions = { setCurrentPeriod, setViewMode, updateCurrentTime, goToNextPeriod, goToPreviousPeriod };
export type UseCalendarAction = ActionType<typeof actions>;
