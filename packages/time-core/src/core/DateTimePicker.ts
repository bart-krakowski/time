/**
 * Core DateTimePicker class combining date and time selection
 */

import { DatePicker, type DatePickerOptions } from './DatePicker'
import { TimePicker, type TimePickerOptions } from './TimePicker'

export interface DateTimePickerState {
  selectedDateTime: Date | null
  datePicker: DatePicker
  timePicker: TimePicker
}

export interface DateTimePickerOptions {
  datePickerOptions?: DatePickerOptions
  timePickerOptions?: TimePickerOptions
  initialDateTime?: Date
  onSelect?: (dateTime: Date) => void
  onClear?: () => void
}

type DateTimePickerListener = (state: DateTimePickerState) => void

export class DateTimePicker {
  private state: DateTimePickerState
  private listeners: Set<DateTimePickerListener> = new Set()
  private options: Pick<DateTimePickerOptions, 'onSelect' | 'onClear'>

  constructor(options: DateTimePickerOptions = {}) {
    this.options = {
      onSelect: options.onSelect,
      onClear: options.onClear,
    }

    // Initialize date and time pickers
    const datePicker = new DatePicker({
      ...options.datePickerOptions,
      mode: options.datePickerOptions?.mode ?? 'single',
      onSelect: (date) => {
        if (date instanceof Date) {
          this.syncDateTime(date, this.timePicker.selectedTime)
        }
        options.datePickerOptions?.onSelect?.(date)
      },
    })

    const timePicker = new TimePicker({
      ...options.timePickerOptions,
      onSelect: (time) => {
        this.syncDateTime(this.datePicker.selectedDate, time)
        options.timePickerOptions?.onSelect?.(time)
      },
    })

    // Set initial date time if provided
    if (options.initialDateTime) {
      const date = new Date(options.initialDateTime)
      date.setHours(0, 0, 0, 0)
      datePicker.selectDate(date)

      const time = new Date(options.initialDateTime)
      timePicker.setTime(time)
    }

    this.state = {
      selectedDateTime: options.initialDateTime ?? null,
      datePicker,
      timePicker,
    }

    // Subscribe to date picker changes
    datePicker.subscribe(() => {
      this.updateSelectedDateTime()
    })

    // Subscribe to time picker changes
    timePicker.subscribe(() => {
      this.updateSelectedDateTime()
    })
  }

  // Getters
  get selectedDateTime(): Date | null {
    return this.state.selectedDateTime
  }

  get datePicker(): DatePicker {
    return this.state.datePicker
  }

  get timePicker(): TimePicker {
    return this.state.timePicker
  }

  // Methods
  selectDateTime(date: Date, time: Date): void {
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)

    this.datePicker.selectDate(dateOnly)
    this.timePicker.setTime(time)
  }

  clear(): void {
    this.datePicker.clear()
    this.timePicker.clear()
    this.state = {
      ...this.state,
      selectedDateTime: null,
    }
    this.notify()
    this.options.onClear?.()
  }

  open(): void {
    this.datePicker.open()
    this.timePicker.open()
  }

  close(): void {
    this.datePicker.close()
    this.timePicker.close()
  }

  toggle(): void {
    if (this.datePicker.isOpen || this.timePicker.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  // Subscription
  subscribe(listener: DateTimePickerListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Private helpers
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private syncDateTime(date: Date | null, time: Date | null): void {
    if (!date || !time) {
      this.state = {
        ...this.state,
        selectedDateTime: null,
      }
      this.notify()
      return
    }

    const dateTime = new Date(date)
    dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())

    this.state = {
      ...this.state,
      selectedDateTime: dateTime,
    }

    this.notify()
    this.options.onSelect?.(dateTime)
  }

  private updateSelectedDateTime(): void {
    const date = this.datePicker.selectedDate
    const time = this.timePicker.selectedTime

    this.syncDateTime(date, time)
  }
}
