import { Store } from '@tanstack/store';
import { Temporal } from '@js-temporal/polyfill';
import { CalendarCore } from './calendar';
import type { CalendarCoreOptions, CalendarState } from './calendar';

export interface DatePickerOptions extends CalendarCoreOptions {
  minDate?: Temporal.PlainDate;
  maxDate?: Temporal.PlainDate;
  multiple?: boolean;
  range?: boolean;
  selectedDates?: Temporal.PlainDate[];
}

export interface DatePickerCoreState extends CalendarState {
  selectedDates: Map<string, Temporal.PlainDate>;
}

export class DatePickerCore extends CalendarCore {
  datePickerStore: Store<DatePickerCoreState>;
  options: DatePickerOptions;

  constructor(options: DatePickerOptions) {
    super(options);
    this.options = options;
    this.datePickerStore = new Store<DatePickerCoreState>({
      ...this.store.state,
      selectedDates: new Map(options.selectedDates?.map(date => [date.toString(), date]) ?? []),
    });
  }

  getSelectedDates() {
    return Array.from(this.datePickerStore.state.selectedDates.values());
  }

  selectDate(date: Temporal.PlainDate) {
    const { multiple, range, minDate, maxDate } = this.options;

    if (minDate && Temporal.PlainDate.compare(date, minDate) < 0) return;
    if (maxDate && Temporal.PlainDate.compare(date, maxDate) > 0) return;

    const selectedDates = new Map(this.datePickerStore.state.selectedDates);

    if (range && selectedDates.size === 1) {
      selectedDates.set(date.toString(), date);
    } else if (multiple) {
      if (selectedDates.has(date.toString())) {
        selectedDates.delete(date.toString());
      } else {
        selectedDates.set(date.toString(), date);
      }
    } else {
      selectedDates.clear();
      selectedDates.set(date.toString(), date);
    }

    this.datePickerStore.setState(prev => ({
      ...prev,
      selectedDates,
    }));
  }
}
