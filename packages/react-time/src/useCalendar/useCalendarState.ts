import type { Temporal } from '@js-temporal/polyfill';

export interface Event {
  id: string;
  startDate: Temporal.PlainDateTime;
  endDate: Temporal.PlainDateTime;
  title: string;
}

export interface UseCalendarState {
  currPeriod: Temporal.PlainDate;
  viewMode: 'month' | 'week' | number;
  currentTime: Temporal.PlainDateTime;
  weekStartsOn: number;
}
