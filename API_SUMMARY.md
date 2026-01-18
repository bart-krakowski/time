# TanStack Time - API Design Summary

## Overview

TanStack Time is a headless, framework-agnostic library for building time and calendar components. It provides core utilities and state management without any UI, allowing developers to build custom calendar and time picker interfaces.

## Package Structure

```
@tanstack/time-core          # Core utilities (framework agnostic)
├── Calendar                  # Calendar navigation and view management
├── DatePicker                # Date selection (single, range, multiple)
├── TimePicker                # Time selection (hours, minutes, seconds)
├── DateTimePicker            # Combined date and time selection
├── DateUtils                 # Date manipulation utilities
└── AccessibilityUtils        # ARIA and keyboard navigation helpers

@tanstack/time-react          # React hooks
├── useCalendar
├── useDatePicker
├── useTimePicker
├── useDateTimePicker
└── useCalendarDatePicker     # Composed hook

@tanstack/time-solid          # Solid stores
├── createCalendar
├── createDatePicker
├── createTimePicker
└── createDateTimePicker

@tanstack/time-vue            # Vue composables
├── useCalendar
├── useDatePicker
├── useTimePicker
└── useDateTimePicker

@tanstack/time-svelte         # Svelte stores
├── createCalendar
├── createDatePicker
├── createTimePicker
└── createDateTimePicker

@tanstack/time-angular        # Angular services
├── CalendarService
├── DatePickerService
├── TimePickerService
└── DateTimePickerService
```

## Core Classes

### Calendar

Manages calendar state, navigation, and view rendering.

**Key Features:**
- Multiple view modes: month, week, day, year
- Locale and timezone support
- Customizable first day of week
- Reactive state with subscriptions
- Computed calendar data (days, weeks, months, years)

**Methods:**
- `navigate(direction)` - Navigate prev/next/today
- `setView(view)` - Change view mode
- `setFocusedDate(date)` - Focus a specific date
- `getDays()` - Get array of calendar days
- `getWeeks()` - Get array of calendar weeks
- `getMonths()` - Get array of calendar months
- `getYears()` - Get array of calendar years
- `subscribe(listener)` - Subscribe to state changes

### DatePicker

Manages date selection state and validation.

**Key Features:**
- Three selection modes: single, range, multiple
- Date validation (min/max, disabled dates/days)
- Selectable date ranges
- Open/close state management
- Reactive state with subscriptions

**Methods:**
- `selectDate(date)` - Select a date (behavior depends on mode)
- `selectRange(start, end)` - Select a date range
- `addDate(date)` - Add date to multiple selection
- `removeDate(date)` - Remove date from multiple selection
- `clear()` - Clear all selections
- `isDateSelectable(date)` - Check if date can be selected
- `isDateDisabled(date)` - Check if date is disabled
- `isDateSelected(date)` - Check if date is selected
- `enhanceCalendarDay(day)` - Add selection state to calendar day
- `subscribe(listener)` - Subscribe to state changes

### TimePicker

Manages time selection (hours, minutes, seconds).

**Key Features:**
- 12h and 24h format support
- Configurable step intervals
- Min/max time constraints
- Meridiem (AM/PM) handling
- Formatted time output

**Methods:**
- `setTime(time)` - Set complete time
- `setHour(hour)` - Set hour
- `setMinute(minute)` - Set minute
- `setSecond(second)` - Set second
- `setMeridiem(meridiem)` - Set AM/PM
- `clear()` - Clear time selection
- `getHours()` - Get available hours
- `getMinutes()` - Get available minutes
- `getSeconds()` - Get available seconds
- `getFormattedTime()` - Get formatted time string
- `subscribe(listener)` - Subscribe to state changes

### DateTimePicker

Combines DatePicker and TimePicker for date-time selection.

**Key Features:**
- Composed from DatePicker and TimePicker
- Synchronized date and time state
- Single unified API

**Methods:**
- `selectDateTime(date, time)` - Select date and time together
- `clear()` - Clear both date and time
- `open()` / `close()` - Control both pickers
- `subscribe(listener)` - Subscribe to state changes

## Design Principles

### 1. Headless Architecture

- No UI components provided
- Only state management and logic
- Framework-agnostic core
- Framework-specific adapters

### 2. Composable Design

- Small, focused utilities
- Can be used independently or together
- Easy to extend and customize

### 3. Type Safety

- Full TypeScript support
- Strict typing throughout
- IntelliSense support

### 4. Accessibility First

- ARIA attributes built-in
- Keyboard navigation support
- Screen reader friendly
- WCAG compliant

### 5. Performance

- Lazy computation of calendar data
- Efficient state updates
- Minimal re-renders
- Optimized for large date ranges

### 6. Internationalization

- Locale support via Intl API
- Timezone handling
- Customizable date/time formatting
- RTL support ready

## State Management Pattern

All core classes use a subscription-based reactive pattern:

```typescript
const calendar = new Calendar(options)

// Subscribe to changes
const unsubscribe = calendar.subscribe((state) => {
  console.log('State changed:', state)
})

// Unsubscribe when done
unsubscribe()
```

Framework adapters convert this to framework-specific reactivity:
- React: Hooks with useState/useEffect
- Solid: Stores with createSignal
- Vue: Ref/Reactive with watch
- Svelte: Stores with writable
- Angular: Services with RxJS Observables

## Integration Patterns

### With Calendar UI Libraries

```typescript
// Works with any calendar UI component
import { Calendar } from '@tanstack/time-core'
import { MyCustomCalendarUI } from './MyCalendar'

const calendar = new Calendar()
const days = calendar.getDays()

<MyCustomCalendarUI days={days} onDayClick={(day) => calendar.setFocusedDate(day.date)} />
```

### With Form Libraries

```typescript
// Integrates with form libraries
import { DatePicker } from '@tanstack/time-core'
import { useForm } from 'react-hook-form'

const datePicker = useDatePicker()
const form = useForm()

// Sync with form
datePicker.subscribe((state) => {
  form.setValue('date', state.selectedDate)
})
```

### With State Management

```typescript
// Works with Redux, Zustand, etc.
import { DatePicker } from '@tanstack/time-core'
import { useStore } from './store'

const datePicker = useDatePicker()

datePicker.subscribe((state) => {
  useStore.getState().setSelectedDate(state.selectedDate)
})
```

## Extension Points

### Custom Validation

```typescript
const datePicker = new DatePicker({
  disabledDates: (date) => {
    // Custom validation logic
    return isHoliday(date) || isWeekend(date)
  },
})
```

### Custom Formatting

```typescript
import { DateUtils } from '@tanstack/time-core'

const formatted = DateUtils.format(date, 'YYYY-MM-DD', 'en-US')
```

### Custom Keyboard Navigation

```typescript
import { AccessibilityUtils } from '@tanstack/time-core'

const handlers = AccessibilityUtils.getDatePickerKeyboardHandlers({
  onSelectDate: (date) => datePicker.selectDate(date),
  getFocusedDate: () => calendar.focusedDate,
  setFocusedDate: (date) => calendar.setFocusedDate(date),
})
```

## Migration Path

For existing calendar/time picker libraries:

1. **Replace state management** - Use TanStack Time classes
2. **Keep UI components** - Use existing UI, connect to TanStack Time
3. **Gradual adoption** - Migrate one component at a time
4. **Framework migration** - Switch frameworks without changing core logic

## Performance Considerations

- Calendar days computed on-demand
- State updates are batched
- Subscriptions are efficient
- No unnecessary re-renders
- Memory efficient for large date ranges

## Browser Support

- Modern browsers (ES2020+)
- TypeScript 4.5+
- Node.js 16+ (for SSR)
- No polyfills required for core functionality

## Future Enhancements

- Recurring date patterns
- Timezone conversion utilities
- Advanced date range operations
- Calendar event management
- Multi-calendar support
- Custom calendar systems (lunar, etc.)
