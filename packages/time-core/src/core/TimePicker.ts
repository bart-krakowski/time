/**
 * Core TimePicker class for managing time selection state
 */

export type TimeFormat = '12h' | '24h'

export interface TimePickerState {
  selectedTime: Date | null
  hour: number | null
  minute: number | null
  second: number | null
  meridiem: 'am' | 'pm' | null
  isOpen: boolean
}

export interface TimePickerOptions {
  format?: TimeFormat
  initialTime?: Date
  step?: { hours?: number; minutes?: number; seconds?: number }
  minTime?: Date
  maxTime?: Date
  showSeconds?: boolean
  showMeridiem?: boolean
  onSelect?: (time: Date) => void
  onClear?: () => void
}

type TimePickerListener = (state: TimePickerState) => void

export class TimePicker {
  private state: TimePickerState
  private listeners: Set<TimePickerListener> = new Set()
  private options: Required<Pick<TimePickerOptions, 'format' | 'showSeconds' | 'showMeridiem'>> &
    Pick<TimePickerOptions, 'step' | 'minTime' | 'maxTime' | 'onSelect' | 'onClear'>

  constructor(options: TimePickerOptions = {}) {
    this.options = {
      format: options.format ?? '12h',
      showSeconds: options.showSeconds ?? false,
      showMeridiem: options.format === '12h' ? (options.showMeridiem ?? true) : false,
      step: options.step ?? { hours: 1, minutes: 1, seconds: 1 },
      minTime: options.minTime,
      maxTime: options.maxTime,
      onSelect: options.onSelect,
      onClear: options.onClear,
    }

    const initialState = this.initializeState(options.initialTime)

    this.state = {
      ...initialState,
      isOpen: false,
    }
  }

  // Getters
  get selectedTime(): Date | null {
    return this.state.selectedTime
  }

  get hour(): number | null {
    return this.state.hour
  }

  get minute(): number | null {
    return this.state.minute
  }

  get second(): number | null {
    return this.state.second
  }

  get meridiem(): 'am' | 'pm' | null {
    return this.state.meridiem
  }

  get isOpen(): boolean {
    return this.state.isOpen
  }

  // Time setting methods
  setTime(time: Date): void {
    const hour = time.getHours()
    const minute = time.getMinutes()
    const second = time.getSeconds()

    this.setHour(hour)
    this.setMinute(minute)
    if (this.options.showSeconds) {
      this.setSecond(second)
    }
  }

  setHour(hour: number): void {
    if (this.options.format === '12h') {
      if (hour < 0 || hour > 23) return
      const { hour12, meridiem } = this.convertTo12Hour(hour)
      this.state = {
        ...this.state,
        hour: hour12,
        meridiem,
      }
    } else {
      if (hour < 0 || hour > 23) return
      this.state = {
        ...this.state,
        hour,
      }
    }

    this.updateSelectedTime()
    this.notify()
  }

  setMinute(minute: number): void {
    if (minute < 0 || minute > 59) return

    this.state = {
      ...this.state,
      minute,
    }

    this.updateSelectedTime()
    this.notify()
  }

  setSecond(second: number): void {
    if (second < 0 || second > 59) return

    this.state = {
      ...this.state,
      second,
    }

    this.updateSelectedTime()
    this.notify()
  }

  setMeridiem(meridiem: 'am' | 'pm'): void {
    if (this.options.format !== '12h') return

    this.state = {
      ...this.state,
      meridiem,
    }

    this.updateSelectedTime()
    this.notify()
  }

  clear(): void {
    this.state = {
      ...this.state,
      selectedTime: null,
      hour: null,
      minute: null,
      second: null,
      meridiem: null,
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

  // Computed data methods
  getHours(): number[] {
    const hours: number[] = []
    const step = this.options.step?.hours ?? 1

    if (this.options.format === '12h') {
      for (let i = 1; i <= 12; i += step) {
        hours.push(i)
      }
    } else {
      for (let i = 0; i < 24; i += step) {
        hours.push(i)
      }
    }

    return hours
  }

  getMinutes(): number[] {
    const minutes: number[] = []
    const step = this.options.step?.minutes ?? 1

    for (let i = 0; i < 60; i += step) {
      minutes.push(i)
    }

    return minutes
  }

  getSeconds(): number[] {
    const seconds: number[] = []
    const step = this.options.step?.seconds ?? 1

    for (let i = 0; i < 60; i += step) {
      seconds.push(i)
    }

    return seconds
  }

  getFormattedTime(): string {
    if (!this.state.selectedTime) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: this.options.format === '12h',
    }

    if (this.options.showSeconds) {
      options.second = '2-digit'
    }

    return new Intl.DateTimeFormat('en-US', options).format(this.state.selectedTime)
  }

  // Subscription
  subscribe(listener: TimePickerListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Private helpers
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private initializeState(initialTime?: Date): Omit<TimePickerState, 'isOpen'> {
    if (!initialTime) {
      return {
        selectedTime: null,
        hour: null,
        minute: null,
        second: null,
        meridiem: null,
      }
    }

    const hour = initialTime.getHours()
    const minute = initialTime.getMinutes()
    const second = initialTime.getSeconds()

    if (this.options.format === '12h') {
      const { hour12, meridiem } = this.convertTo12Hour(hour)
      return {
        selectedTime: initialTime,
        hour: hour12,
        minute,
        second: this.options.showSeconds ? second : null,
        meridiem,
      }
    } else {
      return {
        selectedTime: initialTime,
        hour,
        minute,
        second: this.options.showSeconds ? second : null,
        meridiem: null,
      }
    }
  }

  private updateSelectedTime(): void {
    if (this.state.hour === null || this.state.minute === null) {
      this.state = { ...this.state, selectedTime: null }
      return
    }

    let hour24 = this.state.hour

    if (this.options.format === '12h') {
      if (this.state.meridiem === null) {
        this.state = { ...this.state, selectedTime: null }
        return
      }
      hour24 = this.convertTo24Hour(this.state.hour, this.state.meridiem)
    }

    const now = new Date()
    const time = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour24,
      this.state.minute,
      this.state.second ?? 0
    )

    // Validate against min/max time
    if (this.options.minTime && time < this.options.minTime) {
      return
    }

    if (this.options.maxTime && time > this.options.maxTime) {
      return
    }

    this.state = { ...this.state, selectedTime: time }
    this.options.onSelect?.(time)
  }

  private convertTo12Hour(hour24: number): { hour12: number; meridiem: 'am' | 'pm' } {
    if (hour24 === 0) {
      return { hour12: 12, meridiem: 'am' }
    }
    if (hour24 < 12) {
      return { hour12: hour24, meridiem: 'am' }
    }
    if (hour24 === 12) {
      return { hour12: 12, meridiem: 'pm' }
    }
    return { hour12: hour24 - 12, meridiem: 'pm' }
  }

  private convertTo24Hour(hour12: number, meridiem: 'am' | 'pm'): number {
    if (meridiem === 'am') {
      return hour12 === 12 ? 0 : hour12
    } else {
      return hour12 === 12 ? 12 : hour12 + 12
    }
  }
}
