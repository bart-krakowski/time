import type { Temporal } from '@js-temporal/polyfill';

export interface DatePickerState {
  selectedDate: Temporal.PlainDate | null;
  minDate: Temporal.PlainDate | null;
  maxDate: Temporal.PlainDate | null;
  currPeriod: Temporal.PlainDate;
}
