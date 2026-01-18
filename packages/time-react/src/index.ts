/**
 * @tanstack/time-react
 * 
 * React hooks for TanStack Time
 */

import { useMemo, useEffect, useState, useCallback } from 'react'
import type {
  Calendar,
  CalendarOptions,
  CalendarState,
} from '@tanstack/time-core'
import type {
  DatePicker,
  DatePickerOptions,
  DatePickerState,
} from '@tanstack/time-core'
import type {
  TimePicker,
  TimePickerOptions,
  TimePickerState,
} from '@tanstack/time-core'
import type {
  DateTimePicker,
  DateTimePickerOptions,
  DateTimePickerState,
} from '@tanstack/time-core'

import { Calendar as CalendarClass } from '@tanstack/time-core'
import { DatePicker as DatePickerClass } from '@tanstack/time-core'
import { TimePicker as TimePickerClass } from '@tanstack/time-core'
import { DateTimePicker as DateTimePickerClass } from '@tanstack/time-core'

/**
 * React hook for Calendar
 */
export function useCalendar(options?: CalendarOptions): Calendar {
  const calendar = useMemo(() => new CalendarClass(options), [])

  // Update options when they change
  useEffect(() => {
    if (options?.locale) {
      // Update locale if needed
    }
    if (options?.timezone) {
      // Update timezone if needed
    }
  }, [options?.locale, options?.timezone])

  return calendar
}

/**
 * React hook for DatePicker
 */
export function useDatePicker(options?: DatePickerOptions): DatePicker {
  const datePicker = useMemo(() => new DatePickerClass(options), [])

  return datePicker
}

/**
 * React hook for TimePicker
 */
export function useTimePicker(options?: TimePickerOptions): TimePicker {
  const timePicker = useMemo(() => new TimePickerClass(options), [])

  return timePicker
}

/**
 * React hook for DateTimePicker
 */
export function useDateTimePicker(options?: DateTimePickerOptions): DateTimePicker {
  const dateTimePicker = useMemo(() => new DateTimePickerClass(options), [])

  return dateTimePicker
}

/**
 * React hook that returns reactive state from Calendar
 */
export function useCalendarState(calendar: Calendar): CalendarState {
  const [state, setState] = useState<CalendarState>(() => ({
    view: calendar.view,
    focusedDate: calendar.focusedDate,
    visibleRange: calendar.visibleRange,
    locale: calendar.locale,
    timezone: calendar.timezone,
    firstDayOfWeek: calendar.firstDayOfWeek,
  }))

  useEffect(() => {
    const unsubscribe = calendar.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [calendar])

  return state
}

/**
 * React hook that returns reactive state from DatePicker
 */
export function useDatePickerState(datePicker: DatePicker): DatePickerState {
  const [state, setState] = useState<DatePickerState>(() => ({
    mode: datePicker.mode,
    selectedDate: datePicker.selectedDate,
    selectedRange: datePicker.selectedRange,
    selectedDates: datePicker.selectedDates,
    isOpen: datePicker.isOpen,
  }))

  useEffect(() => {
    const unsubscribe = datePicker.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [datePicker])

  return state
}

/**
 * React hook that returns reactive state from TimePicker
 */
export function useTimePickerState(timePicker: TimePicker): TimePickerState {
  const [state, setState] = useState<TimePickerState>(() => ({
    selectedTime: timePicker.selectedTime,
    hour: timePicker.hour,
    minute: timePicker.minute,
    second: timePicker.second,
    meridiem: timePicker.meridiem,
    isOpen: timePicker.isOpen,
  }))

  useEffect(() => {
    const unsubscribe = timePicker.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [timePicker])

  return state
}

/**
 * React hook that returns reactive state from DateTimePicker
 */
export function useDateTimePickerState(dateTimePicker: DateTimePicker): DateTimePickerState {
  const [state, setState] = useState<DateTimePickerState>(() => ({
    selectedDateTime: dateTimePicker.selectedDateTime,
    datePicker: dateTimePicker.datePicker,
    timePicker: dateTimePicker.timePicker,
  }))

  useEffect(() => {
    const unsubscribe = dateTimePicker.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [dateTimePicker])

  return state
}

/**
 * Composed hook for Calendar + DatePicker
 */
export interface CalendarDatePickerOptions {
  calendarOptions?: CalendarOptions
  datePickerOptions?: DatePickerOptions
}

export function useCalendarDatePicker(options?: CalendarDatePickerOptions) {
  const calendar = useCalendar(options?.calendarOptions)
  const datePicker = useDatePicker(options?.datePickerOptions)
  const calendarState = useCalendarState(calendar)
  const datePickerState = useDatePickerState(datePicker)

  // Enhance calendar days with date picker state
  const enhancedDays = useMemo(() => {
    const days = calendar.getDays()
    return days.map((day) => datePicker.enhanceCalendarDay(day))
  }, [calendar, datePicker, calendarState, datePickerState])

  const handleDayClick = useCallback(
    (day: { date: Date }) => {
      datePicker.selectDate(day.date)
    },
    [datePicker]
  )

  return {
    calendar,
    datePicker,
    calendarState,
    datePickerState,
    days: enhancedDays,
    weeks: calendar.getWeeks(),
    handleDayClick,
  }
}
