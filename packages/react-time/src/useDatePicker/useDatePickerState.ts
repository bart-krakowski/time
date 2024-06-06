import type { Temporal } from '@js-temporal/polyfill';

export interface UseDatePickerState {
  selectedDates: Map<string, Temporal.PlainDate>;
  currPeriod: Temporal.PlainDate;
}
