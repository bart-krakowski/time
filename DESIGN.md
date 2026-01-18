# TanStack Time - API Design

## Overview

TanStack Time is a headless, framework-agnostic library for building time and calendar components. It provides core utilities and state management without any UI, allowing developers to build custom calendar and time picker interfaces.

## Core Principles

1. **Headless**: No UI components, only state and logic
2. **Framework Agnostic**: Core works in vanilla TS/JS
3. **Composable**: Small, focused utilities that compose together
4. **Type Safe**: Full TypeScript support with strict types
5. **Accessible**: Built with accessibility in mind (ARIA attributes, keyboard navigation)
6. **Flexible**: Support multiple selection modes, date ranges, timezones, etc.

## Architecture

```
@tanstack/time-core          # Core utilities (framework agnostic)
├── @tanstack/time-react     # React hooks
├── @tanstack/time-solid     # Solid stores
├── @tanstack/time-vue       # Vue composables
├── @tanstack/time-svelte    # Svelte stores
└── @tanstack/time-angular   # Angular services
```

## Core API Design

### 1. Calendar Core

#### `Calendar` Class

The main calendar state manager for navigating and viewing calendar data.

```typescript
class Calendar {
  // Configuration
  locale: string
  timezone: string
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6

  // State
  view: CalendarView // 'month' | 'week' | 'day' | 'year'
  focusedDate: Date
  visibleRange: { start: Date; end: Date }

  // Methods
  navigate(direction: 'prev' | 'next' | 'today'): void
  setView(view: CalendarView): void
  setFocusedDate(date: Date): void
  goToDate(date: Date): void

  // Computed
  getDays(): CalendarDay[]
  getWeeks(): CalendarWeek[]
  getMonths(): CalendarMonth[]
  getYears(): CalendarYear[]

  // Events
  subscribe(listener: (state: CalendarState) => void): () => void
}
```

#### `CalendarDay` Interface

```typescript
interface CalendarDay {
  date: Date
  dayOfMonth: number
  dayOfWeek: number
  weekOfYear: number
  month: number
  year: number
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  isCurrentMonth: boolean
  isCurrentWeek: boolean
  isWeekend: boolean
  isDisabled: boolean
  isSelected: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  ariaLabel: string
}
```

### 2. Date Picker Core

#### `DatePicker` Class

Manages date selection state and validation.

```typescript
class DatePicker {
  // Configuration
  mode: 'single' | 'range' | 'multiple'
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabledDays?: number[] // 0-6 for days of week
  selectableRange?: { start: Date; end: Date }

  // State
  selectedDate: Date | null
  selectedRange: { start: Date | null; end: Date | null }
  selectedDates: Date[]
  isOpen: boolean

  // Methods
  selectDate(date: Date): void
  selectRange(start: Date, end: Date): void
  addDate(date: Date): void
  removeDate(date: Date): void
  clear(): void
  open(): void
  close(): void
  toggle(): void

  // Validation
  isDateSelectable(date: Date): boolean
  isDateDisabled(date: Date): boolean
  isDateInRange(date: Date): boolean

  // Events
  subscribe(listener: (state: DatePickerState) => void): () => void
}
```

### 3. Time Picker Core

#### `TimePicker` Class

Manages time selection (hours, minutes, seconds).

```typescript
class TimePicker {
  // Configuration
  format: '12h' | '24h'
  step: { hours?: number; minutes?: number; seconds?: number }
  minTime?: Date
  maxTime?: Date
  showSeconds: boolean
  showMeridiem: boolean

  // State
  selectedTime: Date | null
  hour: number | null
  minute: number | null
  second: number | null
  meridiem: 'am' | 'pm' | null
  isOpen: boolean

  // Methods
  setTime(time: Date): void
  setHour(hour: number): void
  setMinute(minute: number): void
  setSecond(second: number): void
  setMeridiem(meridiem: 'am' | 'pm'): void
  clear(): void
  open(): void
  close(): void

  // Computed
  getHours(): number[]
  getMinutes(): number[]
  getSeconds(): number[]
  getFormattedTime(): string

  // Events
  subscribe(listener: (state: TimePickerState) => void): () => void
}
```

### 4. DateTime Picker Core

#### `DateTimePicker` Class

Combines date and time selection.

```typescript
class DateTimePicker {
  // Composition
  datePicker: DatePicker
  timePicker: TimePicker

  // State
  selectedDateTime: Date | null

  // Methods
  selectDateTime(date: Date, time: Date): void
  clear(): void

  // Events
  subscribe(listener: (state: DateTimePickerState) => void): () => void
}
```

### 5. Core Utilities

#### Date Utilities

```typescript
class DateUtils {
  static startOfDay(date: Date): Date
  static endOfDay(date: Date): Date
  static startOfWeek(date: Date, weekStartsOn?: number): Date
  static endOfWeek(date: Date, weekStartsOn?: number): Date
  static startOfMonth(date: Date): Date
  static endOfMonth(date: Date): Date
  static startOfYear(date: Date): Date
  static endOfYear(date: Date): Date

  static addDays(date: Date, days: number): Date
  static addWeeks(date: Date, weeks: number): Date
  static addMonths(date: Date, months: number): Date
  static addYears(date: Date, years: number): Date

  static isSameDay(date1: Date, date2: Date): boolean
  static isSameWeek(date1: Date, date2: Date): boolean
  static isSameMonth(date1: Date, date2: Date): boolean
  static isSameYear(date1: Date, date2: Date): boolean

  static isBefore(date1: Date, date2: Date): boolean
  static isAfter(date1: Date, date2: Date): boolean
  static isBetween(date: Date, start: Date, end: Date): boolean

  static differenceInDays(date1: Date, date2: Date): number
  static differenceInWeeks(date1: Date, date2: Date): number
  static differenceInMonths(date1: Date, date2: Date): number
  static differenceInYears(date1: Date, date2: Date): number

  static format(date: Date, format: string, locale?: string): string
  static parse(dateString: string, format: string, locale?: string): Date
}
```

#### Timezone Utilities

```typescript
class TimezoneUtils {
  static convert(date: Date, fromTz: string, toTz: string): Date
  static toUTC(date: Date, timezone: string): Date
  static fromUTC(date: Date, timezone: string): Date
  static getTimezoneOffset(timezone: string): number
  static getAvailableTimezones(): string[]
}
```

#### Formatting Utilities

```typescript
class FormatUtils {
  static formatDate(date: Date, format: string, locale?: string): string
  static formatTime(date: Date, format: '12h' | '24h', locale?: string): string
  static formatDateTime(date: Date, format: string, locale?: string): string
  static parseDate(dateString: string, format: string, locale?: string): Date
  static parseTime(timeString: string, format: '12h' | '24h', locale?: string): Date
}
```

## Framework Adapters

### React (`@tanstack/time-react`)

```typescript
function useCalendar(options?: CalendarOptions): Calendar
function useDatePicker(options?: DatePickerOptions): DatePicker
function useTimePicker(options?: TimePickerOptions): TimePicker
function useDateTimePicker(options?: DateTimePickerOptions): DateTimePicker

// Composed hooks
function useCalendarDatePicker(options?: CalendarDatePickerOptions): {
  calendar: Calendar
  datePicker: DatePicker
}
```

### Solid (`@tanstack/time-solid`)

```typescript
function createCalendar(options?: CalendarOptions): Calendar
function createDatePicker(options?: DatePickerOptions): DatePicker
function createTimePicker(options?: TimePickerOptions): TimePicker
function createDateTimePicker(options?: DateTimePickerOptions): DateTimePicker
```

### Vue (`@tanstack/time-vue`)

```typescript
function useCalendar(options?: CalendarOptions): Calendar
function useDatePicker(options?: DatePickerOptions): DatePicker
function useTimePicker(options?: TimePickerOptions): TimePicker
function useDateTimePicker(options?: DateTimePickerOptions): DateTimePicker
```

### Svelte (`@tanstack/time-svelte`)

```typescript
function createCalendar(options?: CalendarOptions): CalendarStore
function createDatePicker(options?: DatePickerOptions): DatePickerStore
function createTimePicker(options?: TimePickerOptions): TimePickerStore
function createDateTimePicker(options?: DateTimePickerOptions): DateTimePickerStore
```

### Angular (`@tanstack/time-angular`)

```typescript
@Injectable()
class CalendarService {
  create(options?: CalendarOptions): Calendar
}

@Injectable()
class DatePickerService {
  create(options?: DatePickerOptions): DatePicker
}

@Injectable()
class TimePickerService {
  create(options?: TimePickerOptions): TimePicker
}
```

## Accessibility

All classes provide ARIA attributes and keyboard navigation support:

```typescript
interface AccessibilityProps {
  role: string
  ariaLabel: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaDisabled?: boolean
  ariaSelected?: boolean
  ariaCurrent?: 'date' | 'page' | 'step' | 'location' | 'time' | boolean
  tabIndex: number
}

interface KeyboardHandlers {
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onKeyPress: (event: KeyboardEvent) => void
}
```

## Type Definitions

```typescript
type CalendarView = 'month' | 'week' | 'day' | 'year'

type TimeFormat = '12h' | '24h'

type DateSelectionMode = 'single' | 'range' | 'multiple'

interface CalendarOptions {
  locale?: string
  timezone?: string
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  initialView?: CalendarView
  initialDate?: Date
  onNavigate?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
}

interface DatePickerOptions {
  mode?: DateSelectionMode
  initialDate?: Date | Date[] | { start: Date; end: Date }
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabledDays?: number[]
  onSelect?: (date: Date | Date[] | { start: Date; end: Date }) => void
  onClear?: () => void
}

interface TimePickerOptions {
  format?: TimeFormat
  initialTime?: Date
  step?: { hours?: number; minutes?: number; seconds?: number }
  minTime?: Date
  maxTime?: Date
  showSeconds?: boolean
  onSelect?: (time: Date) => void
  onClear?: () => void
}
```

## Usage Examples

### Vanilla TypeScript

```typescript
import { Calendar, DatePicker } from '@tanstack/time-core'

const calendar = new Calendar({
  locale: 'en-US',
  timezone: 'America/New_York',
  firstDayOfWeek: 0
})

const datePicker = new DatePicker({
  mode: 'single',
  minDate: new Date(),
  onSelect: (date) => console.log('Selected:', date)
})

calendar.subscribe((state) => {
  console.log('Calendar state:', state)
})

datePicker.subscribe((state) => {
  console.log('DatePicker state:', state)
})
```

### React

```typescript
import { useCalendar, useDatePicker } from '@tanstack/time-react'

function MyCalendar() {
  const calendar = useCalendar({
    locale: 'en-US',
    initialView: 'month'
  })

  const datePicker = useDatePicker({
    mode: 'single',
    onSelect: (date) => console.log(date)
  })

  const days = calendar.getDays()

  return (
    <div>
      {days.map(day => (
        <button
          key={day.date.toISOString()}
          onClick={() => datePicker.selectDate(day.date)}
          aria-label={day.ariaLabel}
          disabled={day.isDisabled}
        >
          {day.dayOfMonth}
        </button>
      ))}
    </div>
  )
}
```

## Implementation Notes

1. **State Management**: Use a reactive state pattern with subscriptions
2. **Immutability**: All state updates create new state objects
3. **Performance**: Lazy computation of calendar days/weeks/months
4. **Internationalization**: Full i18n support via locale strings
5. **Timezone Support**: Built-in timezone conversion and handling
6. **Validation**: Comprehensive date/time validation
7. **Accessibility**: ARIA attributes and keyboard navigation built-in
