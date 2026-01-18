/**
 * Core DatePicker class for managing date selection state
 */

import type { CalendarDay } from './Calendar'

export type DateSelectionMode = 'single' | 'range' | 'multiple'

export interface DatePickerState {
  mode: DateSelectionMode
  selectedDate: Date | null
  selectedRange: { start: Date | null; end: Date | null }
  selectedDates: Date[]
  isOpen: boolean
}

export interface DatePickerOptions {
  mode?: DateSelectionMode
  initialDate?: Date | Date[] | { start: Date; end: Date }
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabledDays?: number[] // 0-6 for days of week
  selectableRange?: { start: Date; end: Date }
  onSelect?: (date: Date | Date[] | { start: Date; end: Date }) => void
  onClear?: () => void
}

type DatePickerListener = (state: DatePickerState) => void

export class DatePicker {
  private state: DatePickerState
  private listeners: Set<DatePickerListener> = new Set()
  private options: Required<Pick<DatePickerOptions, 'mode'>> &
    Pick<
      DatePickerOptions,
      'minDate' | 'maxDate' | 'disabledDates' | 'disabledDays' | 'selectableRange' | 'onSelect' | 'onClear'
    >

  constructor(options: DatePickerOptions = {}) {
    const mode = options.mode ?? 'single'

    this.options = {
      mode,
      minDate: options.minDate,
      maxDate: options.maxDate,
      disabledDates: options.disabledDates,
      disabledDays: options.disabledDays,
      selectableRange: options.selectableRange,
      onSelect: options.onSelect,
      onClear: options.onClear,
    }

    // Initialize state based on mode and initial values
    const initialState = this.initializeState(mode, options.initialDate)

    this.state = {
      mode,
      ...initialState,
      isOpen: false,
    }
  }

  // Getters
  get mode(): DateSelectionMode {
    return this.state.mode
  }

  get selectedDate(): Date | null {
    return this.state.selectedDate
  }

  get selectedRange(): { start: Date | null; end: Date | null } {
    return this.state.selectedRange
  }

  get selectedDates(): Date[] {
    return this.state.selectedDates
  }

  get isOpen(): boolean {
    return this.state.isOpen
  }

  // Selection methods
  selectDate(date: Date): void {
    if (!this.isDateSelectable(date)) {
      return
    }

    switch (this.state.mode) {
      case 'single':
        this.state = {
          ...this.state,
          selectedDate: date,
          selectedRange: { start: null, end: null },
          selectedDates: [],
        }
        this.options.onSelect?.(date)
        break

      case 'range':
        this.selectRangeDate(date)
        break

      case 'multiple':
        this.toggleDateInMultiple(date)
        break
    }

    this.notify()
  }

  selectRange(start: Date, end: Date): void {
    if (this.state.mode !== 'range') {
      throw new Error('selectRange can only be used in range mode')
    }

    if (!this.isDateSelectable(start) || !this.isDateSelectable(end)) {
      return
    }

    const sortedRange = start <= end ? { start, end } : { start: end, end: start }

    this.state = {
      ...this.state,
      selectedRange: sortedRange,
      selectedDate: null,
      selectedDates: [],
    }

    this.notify()
    this.options.onSelect?.(sortedRange)
  }

  addDate(date: Date): void {
    if (this.state.mode !== 'multiple') {
      throw new Error('addDate can only be used in multiple mode')
    }

    if (!this.isDateSelectable(date)) {
      return
    }

    if (this.state.selectedDates.some((d) => this.isSameDate(d, date))) {
      return
    }

    this.state = {
      ...this.state,
      selectedDates: [...this.state.selectedDates, date].sort((a, b) => a.getTime() - b.getTime()),
    }

    this.notify()
    this.options.onSelect?.(this.state.selectedDates)
  }

  removeDate(date: Date): void {
    if (this.state.mode !== 'multiple') {
      throw new Error('removeDate can only be used in multiple mode')
    }

    this.state = {
      ...this.state,
      selectedDates: this.state.selectedDates.filter((d) => !this.isSameDate(d, date)),
    }

    this.notify()
    this.options.onSelect?.(this.state.selectedDates)
  }

  clear(): void {
    this.state = {
      ...this.state,
      selectedDate: null,
      selectedRange: { start: null, end: null },
      selectedDates: [],
    }

    this.notify()
    this.options.onClear?.()
  }

  // Open/Close methods
  open(): void {
    if (this.state.isOpen) return
    this.state = { ...this.state, isOpen: true }
    this.notify()
  }

  close(): void {
    if (!this.state.isOpen) return
    this.state = { ...this.state, isOpen: false }
    this.notify()
  }

  toggle(): void {
    this.state.isOpen ? this.close() : this.open()
  }

  // Validation methods
  isDateSelectable(date: Date): boolean {
    if (this.isDateDisabled(date)) {
      return false
    }

    if (this.options.minDate && date < this.options.minDate) {
      return false
    }

    if (this.options.maxDate && date > this.options.maxDate) {
      return false
    }

    if (this.options.selectableRange) {
      const { start, end } = this.options.selectableRange
      if (date < start || date > end) {
        return false
      }
    }

    return true
  }

  isDateDisabled(date: Date): boolean {
    if (this.options.disabledDays?.includes(date.getDay())) {
      return true
    }

    if (this.options.disabledDates) {
      if (Array.isArray(this.options.disabledDates)) {
        return this.options.disabledDates.some((disabledDate) => this.isSameDate(disabledDate, date))
      } else {
        return this.options.disabledDates(date)
      }
    }

    return false
  }

  isDateInRange(date: Date): boolean {
    if (this.state.mode !== 'range') {
      return false
    }

    const { start, end } = this.state.selectedRange
    if (!start || !end) {
      return false
    }

    return date >= start && date <= end
  }

  isDateSelected(date: Date): boolean {
    switch (this.state.mode) {
      case 'single':
        return this.state.selectedDate !== null && this.isSameDate(this.state.selectedDate, date)
      case 'range':
        return (
          (this.state.selectedRange.start !== null && this.isSameDate(this.state.selectedRange.start, date)) ||
          (this.state.selectedRange.end !== null && this.isSameDate(this.state.selectedRange.end, date))
        )
      case 'multiple':
        return this.state.selectedDates.some((d) => this.isSameDate(d, date))
    }
  }

  // Enhance calendar day with selection state
  enhanceCalendarDay(day: CalendarDay): CalendarDay {
    return {
      ...day,
      isDisabled: !this.isDateSelectable(day.date),
      isSelected: this.isDateSelected(day.date),
      isInRange: this.isDateInRange(day.date),
      isRangeStart:
        this.state.mode === 'range' &&
        this.state.selectedRange.start !== null &&
        this.isSameDate(this.state.selectedRange.start, day.date),
      isRangeEnd:
        this.state.mode === 'range' &&
        this.state.selectedRange.end !== null &&
        this.isSameDate(this.state.selectedRange.end, day.date),
    }
  }

  // Subscription
  subscribe(listener: DatePickerListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Private helpers
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private initializeState(
    mode: DateSelectionMode,
    initialDate?: Date | Date[] | { start: Date; end: Date }
  ): Omit<DatePickerState, 'mode' | 'isOpen'> {
    if (!initialDate) {
      return {
        selectedDate: null,
        selectedRange: { start: null, end: null },
        selectedDates: [],
      }
    }

    switch (mode) {
      case 'single':
        return {
          selectedDate: initialDate instanceof Date ? initialDate : null,
          selectedRange: { start: null, end: null },
          selectedDates: [],
        }

      case 'range':
        if (Array.isArray(initialDate)) {
          return {
            selectedDate: null,
            selectedRange: { start: null, end: null },
            selectedDates: [],
          }
        }
        if ('start' in initialDate && 'end' in initialDate) {
          return {
            selectedDate: null,
            selectedRange: { start: initialDate.start, end: initialDate.end },
            selectedDates: [],
          }
        }
        return {
          selectedDate: null,
          selectedRange: { start: null, end: null },
          selectedDates: [],
        }

      case 'multiple':
        return {
          selectedDate: null,
          selectedRange: { start: null, end: null },
          selectedDates: Array.isArray(initialDate) ? initialDate : [],
        }
    }
  }

  private selectRangeDate(date: Date): void {
    const { start, end } = this.state.selectedRange

    if (!start || (start && end)) {
      // Start new range
      this.state = {
        ...this.state,
        selectedRange: { start: date, end: null },
        selectedDate: null,
        selectedDates: [],
      }
    } else {
      // Complete range
      const sortedRange = start <= date ? { start, end: date } : { start: date, end: start }
      this.state = {
        ...this.state,
        selectedRange: sortedRange,
        selectedDate: null,
        selectedDates: [],
      }
      this.options.onSelect?.(sortedRange)
    }

    this.notify()
  }

  private toggleDateInMultiple(date: Date): void {
    const index = this.state.selectedDates.findIndex((d) => this.isSameDate(d, date))

    if (index >= 0) {
      this.removeDate(date)
    } else {
      this.addDate(date)
    }
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
}
