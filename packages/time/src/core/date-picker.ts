import { Store } from '@tanstack/store'
import { Temporal } from '@js-temporal/polyfill'
import { getDateDefaults } from '../utils/dateDefaults'
import { CalendarCore } from './calendar'
import type { CalendarCoreOptions, CalendarStore } from './calendar'

export interface DatePickerOptions extends CalendarCoreOptions {
  /**
   * The earliest date that can be selected. Null if no minimum constraint.
   */
  minDate?: Temporal.PlainDate | null
  /**
   * The latest date that can be selected. Null if no maximum constraint.
   */
  maxDate?: Temporal.PlainDate | null
  /**
   * Allows selection of multiple dates.
   */
  multiple?: boolean
  /**
   * Allows selection of a range of dates.
   */
  range?: boolean
  /**
   * Initial set of selected dates.
   */
  selectedDates?: Temporal.PlainDate[]
}

export interface DatePickerCoreState extends CalendarStore {
  /**
   * A map of selected dates, keyed by their string representation.
   */
  selectedDates: Map<string, Temporal.PlainDate>
}

export class DatePickerCore extends CalendarCore {
  datePickerStore: Store<DatePickerCoreState>
  options: Required<DatePickerOptions>

  constructor(options: DatePickerOptions) {
    super(options)
    const defaults = getDateDefaults()

    this.options = {
      ...options,
      multiple: options.multiple ?? false,
      range: options.range ?? false,
      minDate: options.minDate ?? null,
      maxDate: options.maxDate ?? null,
      selectedDates: options.selectedDates ?? [],
      events: options.events ?? [],
      locale: options.locale ?? defaults.locale,
      timeZone: options.timeZone ?? defaults.timeZone,
      calendar: options.calendar ?? defaults.calendar,
    }
    this.datePickerStore = new Store<DatePickerCoreState>({
      ...this.store.state,
      selectedDates: new Map(
        options.selectedDates?.map((date) => [date.toString(), date]) ?? [],
      ),
    })
  }

  getSelectedDates() {
    return Array.from(this.datePickerStore.state.selectedDates.values())
  }

  selectDate(date: Temporal.PlainDate) {
    const { multiple, range, minDate, maxDate } = this.options

    if (minDate && Temporal.PlainDate.compare(date, minDate) < 0) return
    if (maxDate && Temporal.PlainDate.compare(date, maxDate) > 0) return

    const selectedDates = new Map(this.datePickerStore.state.selectedDates)

    if (range && selectedDates.size === 1) {
      selectedDates.set(date.toString(), date)
    } else if (multiple) {
      if (selectedDates.has(date.toString())) {
        selectedDates.delete(date.toString())
      } else {
        selectedDates.set(date.toString(), date)
      }
    } else {
      selectedDates.clear()
      selectedDates.set(date.toString(), date)
    }

    this.datePickerStore.setState((prev) => ({
      ...prev,
      selectedDates,
    }))
  }
}
