# TanStack Time - Headless API Design

## Overview

This document outlines the API design for a headless utilities library for building time and calendar components across TypeScript/JavaScript, React, Solid, Vue, Svelte, and Angular.

## Core Principles

1. **Framework Agnostic**: Core logic is framework-independent
2. **Headless**: No UI rendering, only state management and utilities
3. **Composable**: Small, focused utilities that can be combined
4. **Type Safe**: Full TypeScript support with strict typing
5. **Extensible**: Base classes designed for extension

## Architecture

```
@tanstack/time-core (framework-agnostic)
├── Base Classes
│   ├── DateCore
│   ├── CalendarCore
│   ├── TimeCore
│   ├── TimerCore
│   └── DatePickerCore
├── Utilities
│   ├── DateFormatters
│   ├── DateValidators
│   ├── DateCalculators
│   └── EventProcessors
└── Types & Interfaces

Framework Adapters (thin wrappers)
├── @tanstack/react-time
├── @tanstack/vue-time
├── @tanstack/solid-time
├── @tanstack/svelte-time
└── @tanstack/angular-time
```

## Base Classes

### 1. DateCore

Base class for date manipulation and navigation.

```typescript
export interface DateCoreOptions {
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'day' | 'workWeek'
  }
  locale?: Intl.UnicodeBCP47LocaleIdentifier
  timeZone?: Temporal.TimeZoneLike
  calendar?: Temporal.CalendarLike
  range?: DateRange
  dateFormatter?: Intl.DateTimeFormat
  timeFormatter?: Intl.DateTimeFormat
  dateTimeFormatter?: Intl.DateTimeFormat
}

export interface DateCoreState {
  currentPeriod: Temporal.PlainDate
  activeDate: Temporal.PlainDate
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'day' | 'workWeek'
  }
}

export abstract class DateCore {
  protected store: Store<DateCoreState>
  protected options: ParsedDateCoreOptions
  protected formatters: {
    date: Intl.DateTimeFormat
    time: Intl.DateTimeFormat
    dateTime: Intl.DateTimeFormat
  }

  // Navigation
  abstract goToPreviousPeriod(): void
  abstract goToNextPeriod(): void
  abstract goToCurrentPeriod(): void
  abstract goToSpecificPeriod(date: DateInput): void
  abstract canGoPreviousPeriod(): boolean
  abstract canGoNextPeriod(): boolean

  // View Mode
  abstract changeViewMode(viewMode: DateCoreState['viewMode']): void

  // Formatting
  formatDate(date: DateInput): string
  formatTime(date: DateInput): string
  formatDateTime(date: DateInput): string

  // Utilities
  abstract getDaysNames(weekday?: 'long' | 'short'): string[]
  abstract getCalendarDays(): Temporal.PlainDate[]
  abstract getWeekStartsOn(): number
}
```

### 2. CalendarCore

Extends DateCore with event management capabilities.

```typescript
export interface CalendarCoreOptions<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> extends DateCoreOptions {
  events?: TEvent[] | null
  resources?: TResource[] | null
}

export interface CalendarCoreState<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> extends DateCoreState {
  events: TEvent[] | null
}

export class CalendarCore<
  TResource extends Resource,
  TEvent extends Event<TResource>,
> extends DateCore {
  protected calendarStore: Store<CalendarCoreState<TResource, TEvent>>

  // Event Management
  abstract getEventsByDate(date: string): TEvent[]
  abstract getEventProps(id: Event['id']): EventProps<TEvent> | null
  abstract groupDaysBy(options: GroupDaysByOptions): (Day<TEvent> | null)[][]

  // Time Slots
  abstract getTimeSlots(options?: TimeSlotOptions): TimeSlot[]

  // Event Processing
  protected abstract processEvents(events: TEvent[]): Map<string, TEvent[]>
  protected abstract splitMultiDayEvents(event: TEvent): TEvent[]
}
```

### 3. TimeCore

Base class for time manipulation and duration handling.

```typescript
export interface TimeCoreOptions {
  currentTime: number // in seconds
}

export interface TimeCoreState {
  currentTime: Temporal.Duration
}

export abstract class TimeCore<TState extends TimeCoreState> {
  protected store: Store<TState>

  // Time Operations
  abstract getCurrentTime(): Duration
  abstract add(duration: Temporal.Duration | Temporal.DurationLike): void
  abstract subtract(duration: Temporal.Duration | Temporal.DurationLike): void
  abstract setTime(time: number): void
  abstract reset(): void

  // Formatting
  abstract formatDuration(duration: Temporal.Duration): string
  abstract formatTime(time: number): string
}
```

### 4. TimerCore

Extends TimeCore with timer-specific functionality.

```typescript
export interface TimerCoreOptions extends TimeCoreOptions {
  initialTime: number
  intervalMs?: number
  direction?: 'countdown' | 'countup'
  onFinish?: () => void
  onTick?: (time: number) => void
}

export interface TimerCoreState extends TimeCoreState {
  initialTime: number
  progress: number // 0-100
  state: 'idle' | 'running' | 'stopped' | 'finished'
}

export class TimerCore extends TimeCore<TimerCoreState> {
  // Timer Control
  abstract start(): void
  abstract stop(): void
  abstract pause(): void
  abstract resume(): void
  abstract toggle(): void
  abstract reset(): void

  // Timer State
  abstract getProgress(): number
  abstract getState(): TimerCoreState['state']
  abstract isRunning(): boolean
  abstract isFinished(): boolean
}
```

### 5. DatePickerCore

Base class for date picker functionality.

```typescript
export interface DatePickerCoreOptions extends DateCoreOptions {
  mode?: 'single' | 'range' | 'multiple'
  selectedDates?: DateInput | DateInput[] | { start: DateInput; end: DateInput }
  minDate?: DateInput
  maxDate?: DateInput
  disabledDates?: DateInput[]
  disabledDaysOfWeek?: number[]
  allowPast?: boolean
  allowFuture?: boolean
}

export interface DatePickerCoreState extends DateCoreState {
  selectedDates: Temporal.PlainDate | Temporal.PlainDate[] | { start: Temporal.PlainDate; end: Temporal.PlainDate } | null
  isOpen: boolean
  highlightedDate: Temporal.PlainDate | null
}

export abstract class DatePickerCore extends DateCore {
  protected pickerStore: Store<DatePickerCoreState>

  // Selection
  abstract selectDate(date: DateInput): void
  abstract selectRange(start: DateInput, end: DateInput): void
  abstract selectMultiple(dates: DateInput[]): void
  abstract clearSelection(): void
  abstract isDateSelected(date: DateInput): boolean
  abstract isDateInRange(date: DateInput): boolean

  // Validation
  abstract isDateDisabled(date: DateInput): boolean
  abstract isDateSelectable(date: DateInput): boolean
  abstract canSelectDate(date: DateInput): boolean

  // UI State
  abstract open(): void
  abstract close(): void
  abstract toggle(): void
  abstract highlightDate(date: DateInput | null): void
}
```

## Utility Classes

### DateFormatters

```typescript
export class DateFormatters {
  static format(
    date: DateInput,
    options: Intl.DateTimeFormatOptions,
    locale?: string
  ): string

  static formatRelative(
    date: DateInput,
    baseDate?: DateInput,
    locale?: string
  ): string

  static formatRange(
    start: DateInput,
    end: DateInput,
    options?: Intl.DateTimeFormatOptions,
    locale?: string
  ): string

  static formatDuration(
    duration: Temporal.Duration,
    options?: DurationFormatOptions
  ): string
}
```

### DateValidators

```typescript
export class DateValidators {
  static isInRange(
    date: DateInput,
    range: { start: DateInput; end: DateInput }
  ): boolean

  static isBefore(date: DateInput, compareDate: DateInput): boolean
  static isAfter(date: DateInput, compareDate: DateInput): boolean
  static isSameDay(date1: DateInput, date2: DateInput): boolean
  static isSameMonth(date1: DateInput, date2: DateInput): boolean
  static isSameYear(date1: DateInput, date2: DateInput): boolean
  static isToday(date: DateInput): boolean
  static isWeekend(date: DateInput): boolean
  static isWeekday(date: DateInput): boolean
}
```

### DateCalculators

```typescript
export class DateCalculators {
  static addDays(date: DateInput, days: number): Temporal.PlainDate
  static addWeeks(date: DateInput, weeks: number): Temporal.PlainDate
  static addMonths(date: DateInput, months: number): Temporal.PlainDate
  static addYears(date: DateInput, years: number): Temporal.PlainDate

  static subtractDays(date: DateInput, days: number): Temporal.PlainDate
  static subtractWeeks(date: DateInput, weeks: number): Temporal.PlainDate
  static subtractMonths(date: DateInput, months: number): Temporal.PlainDate
  static subtractYears(date: DateInput, years: number): Temporal.PlainDate

  static getDaysBetween(start: DateInput, end: DateInput): number
  static getWeeksBetween(start: DateInput, end: DateInput): number
  static getMonthsBetween(start: DateInput, end: DateInput): number

  static getStartOfDay(date: DateInput): Temporal.PlainDate
  static getEndOfDay(date: DateInput): Temporal.PlainDate
  static getStartOfWeek(date: DateInput, weekStartsOn?: number): Temporal.PlainDate
  static getEndOfWeek(date: DateInput, weekStartsOn?: number): Temporal.PlainDate
  static getStartOfMonth(date: DateInput): Temporal.PlainDate
  static getEndOfMonth(date: DateInput): Temporal.PlainDate
  static getStartOfYear(date: DateInput): Temporal.PlainDate
  static getEndOfYear(date: DateInput): Temporal.PlainDate

  static getFirstDayOfMonth(date: DateInput): Temporal.PlainDate
  static getLastDayOfMonth(date: DateInput): Temporal.PlainDate
  static getDaysInMonth(date: DateInput): number
  static getDaysInYear(date: DateInput): number

  static getWeekNumber(date: DateInput, weekStartsOn?: number): number
  static getQuarter(date: DateInput): number
}
```

### EventProcessors

```typescript
export class EventProcessors {
  static groupEventsByDate<TEvent extends Event>(
    events: TEvent[],
    timeZone?: string
  ): Map<string, TEvent[]>

  static findOverlappingEvents<TEvent extends Event>(
    events: TEvent[]
  ): Map<string, TEvent[]>

  static splitMultiDayEvent<TEvent extends Event>(
    event: TEvent,
    timeZone?: string
  ): TEvent[]

  static calculateEventPosition(
    event: Event,
    date: string,
    options?: {
      hoursPerDay?: number
      timeZone?: string
    }
  ): EventPosition | null

  static sortEventsByTime<TEvent extends Event>(
    events: TEvent[]
  ): TEvent[]

  static filterEventsByDateRange<TEvent extends Event>(
    events: TEvent[],
    start: DateInput,
    end: DateInput
  ): TEvent[]
}
```

## Framework Adapter Pattern

Each framework adapter provides a thin wrapper around the core classes that:

1. Manages reactive state using framework-specific primitives
2. Provides framework-specific hooks/composables
3. Handles lifecycle and cleanup
4. Exposes the same API surface

### React Adapter Example

```typescript
export function useCalendar<TResource extends Resource, TEvent extends Event<TResource>>(
  options: CalendarCoreOptions<TResource, TEvent>
) {
  const core = useMemo(
    () => new CalendarCore(options),
    [/* dependencies */]
  )

  const state = useStore(core.calendarStore)

  useEffect(() => {
    return () => {
      // cleanup
    }
  }, [])

  return {
    ...core,
    ...state,
    // React-specific helpers
  }
}
```

### Vue Adapter Example

```typescript
export function useCalendar<TResource extends Resource, TEvent extends Event<TResource>>(
  options: MaybeRefOrGetter<CalendarCoreOptions<TResource, TEvent>>
) {
  const core = computed(() => new CalendarCore(toValue(options)))
  const state = useStore(core.value.calendarStore)

  onUnmounted(() => {
    // cleanup
  })

  return {
    ...core.value,
    ...state,
    // Vue-specific helpers
  }
}
```

### Solid Adapter Example

```typescript
export function createCalendar<TResource extends Resource, TEvent extends Event<TResource>>(
  options: Accessor<CalendarCoreOptions<TResource, TEvent>>
) {
  const core = createMemo(() => new CalendarCore(options()))
  const state = createStore(core().calendarStore)

  onCleanup(() => {
    // cleanup
  })

  return {
    ...core(),
    ...state,
    // Solid-specific helpers
  }
}
```

### Svelte Adapter Example

```typescript
export function createCalendar<TResource extends Resource, TEvent extends Event<TResource>>(
  options: CalendarCoreOptions<TResource, TEvent>
) {
  const core = new CalendarCore(options)
  const state = writable(core.calendarStore.state)

  core.calendarStore.subscribe((newState) => {
    state.set(newState)
  })

  return {
    ...core,
    state: readable(state),
    // Svelte-specific helpers
  }
}
```

### Angular Adapter Example

```typescript
@Injectable()
export class CalendarService<TResource extends Resource, TEvent extends Event<TResource>> {
  private core = signal<CalendarCore<TResource, TEvent> | null>(null)
  private state = signal<CalendarCoreState<TResource, TEvent> | null>(null)

  constructor() {
    effect(() => {
      const coreValue = this.core()
      if (coreValue) {
        this.state.set(coreValue.calendarStore.state)
      }
    })
  }

  initialize(options: CalendarCoreOptions<TResource, TEvent>) {
    this.core.set(new CalendarCore(options))
  }

  // Expose core methods and state
}
```

## Type Definitions

```typescript
// Core Types
export type DateInput = string | number | Date | Temporal.PlainDate | Temporal.PlainDateTime

export interface DateRange {
  start: DateInput | null
  end: DateInput | null
}

export interface Resource {
  id: string
  label: string
  [key: string]: unknown
}

export interface Event<TResource extends Resource = Resource> {
  id: string
  start: string
  end: string
  title: string
  description?: string
  resources?: TResource[]
  color?: string
  [key: string]: unknown
}

export interface Day<TEvent extends Event = Event> {
  date: Temporal.PlainDate
  events?: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
  isDisabled?: boolean
  isSelected?: boolean
  isHighlighted?: boolean
}

export interface EventProps<TEvent extends Event> {
  isSplitEvent: boolean
  overlappingEvents: TEvent[]
  position?: EventPosition
}

export interface EventPosition {
  top: string
  height: string
  startTime: string
  endTime: string
}

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export interface TimeSlotOptions {
  interval?: number // minutes
  startHour?: number
  endHour?: number
  format?: '12h' | '24h'
}

export interface GroupDaysByOptions {
  days: Day[]
  unit: 'week' | 'month'
  fillMissingDays?: boolean
}
```

## Extension Points

### Custom Calendar Systems

```typescript
export abstract class CustomCalendarCore extends DateCore {
  // Override methods to support custom calendar systems
  protected abstract getCalendarDays(): Temporal.PlainDate[]
}
```

### Custom Event Processors

```typescript
export interface EventProcessor<TEvent extends Event> {
  process(events: TEvent[]): Map<string, TEvent[]>
  split(event: TEvent): TEvent[]
  calculatePosition(event: TEvent, date: string): EventPosition | null
}
```

### Custom Validators

```typescript
export interface DateValidator {
  validate(date: DateInput): boolean
  getErrorMessage?(date: DateInput): string
}
```

## Best Practices

1. **State Management**: Use `@tanstack/store` for reactive state
2. **Temporal API**: Always use Temporal API for date operations
3. **Immutable Updates**: Never mutate state directly
4. **Type Safety**: Leverage TypeScript generics for extensibility
5. **Composition**: Prefer composition over inheritance where possible
6. **Framework Adapters**: Keep adapters thin, move logic to core

## Migration Path

Existing code can be migrated incrementally:

1. Core classes remain compatible
2. Framework adapters can be updated independently
3. New utilities can be added without breaking changes
4. Deprecated APIs can be marked and removed in major versions
