# Missing Calendar API Methods

This document outlines the missing API methods and utilities that should be provided by the `useCalendar` hook to make it more complete and developer-friendly.

## 1. Event Management

### Add/Update/Delete Events
Currently, events are passed as a static array in options. There's no way to dynamically manage events.

**Missing Methods:**
```typescript
// Add a new event
addEvent: (event: TEvent) => void

// Update an existing event
updateEvent: (id: Event['id'], updates: Partial<TEvent>) => void

// Delete an event
deleteEvent: (id: Event['id']) => void

// Replace all events
setEvents: (events: TEvent[]) => void

// Get event by ID
getEvent: (id: Event['id']) => TEvent | null
```

**Use Case:** Users need to add/edit/delete events dynamically without recreating the calendar instance.

---

## 2. Period Formatting Utilities

Currently, users must manually format period displays for different view modes.

**Missing Methods:**
```typescript
// Format the current period display based on view mode
formatPeriodDisplay: (options?: {
  month?: Intl.DateTimeFormatOptions
  week?: Intl.DateTimeFormatOptions
  day?: Intl.DateTimeFormatOptions
}) => string

// Get formatted period range (start and end dates)
getPeriodRange: () => {
  start: string
  end: string
  formatted: string
}
```

**Use Case:** The example manually implements `formatPeriodDisplay()` - this should be provided by the API.

---

## 3. Period Boundary Helpers

No easy way to get the first/last day of the current period.

**Missing Methods:**
```typescript
// Get the first day of the current period
getFirstDayOfPeriod: () => string

// Get the last day of the current period
getLastDayOfPeriod: () => string

// Get period boundaries as dates
getPeriodBounds: () => {
  start: Temporal.PlainDate
  end: Temporal.PlainDate
}
```

**Use Case:** Needed for displaying period ranges, calculating event visibility, etc.

---

## 4. Time Calculation Utilities for Day View

Currently, users manually calculate event positions for day view.

**Missing Methods:**
```typescript
// Calculate event position in day view (top and height percentages)
getEventTimePosition: (event: TEvent) => {
  top: string // CSS percentage
  height: string // CSS percentage
  startHour: number
  endHour: number
}

// Get time slots for day view
getTimeSlots: (options?: {
  startHour?: number // default: 0
  endHour?: number // default: 24
  interval?: number // minutes, default: 60
}) => Array<{
  hour: number
  minute: number
  label: string
  position: number // 0-100 percentage
}>

// Convert time to percentage position in day
timeToPosition: (time: string | Temporal.PlainDateTime) => number
```

**Use Case:** The example manually implements `getEventTimePosition()` - this should be provided.

---

## 5. Event Querying and Filtering

No way to query events by date, date range, or other criteria.

**Missing Methods:**
```typescript
// Get events for a specific date
getEventsForDate: (date: string | Temporal.PlainDate) => TEvent[]

// Get events for a date range
getEventsForRange: (start: string, end: string) => TEvent[]

// Get events for the current period
getEventsForCurrentPeriod: () => TEvent[]

// Filter events by criteria
filterEvents: (predicate: (event: TEvent) => boolean) => TEvent[]

// Check if a date has events
hasEventsOnDate: (date: string | Temporal.PlainDate) => boolean

// Get event count for a date
getEventCountForDate: (date: string | Temporal.PlainDate) => number
```

**Use Case:** Common operations like highlighting dates with events, filtering by date range, etc.

---

## 6. Resource Management

No way to filter or query by resources.

**Missing Methods:**
```typescript
// Get all unique resources from events
getResources: () => TResource[]

// Get events for a specific resource
getEventsForResource: (resourceId: string) => TEvent[]

// Filter events by resources
filterEventsByResources: (resourceIds: string[]) => TEvent[]

// Check if resource is used in any event
isResourceUsed: (resourceId: string) => boolean
```

**Use Case:** Resource-based filtering, resource availability checks, etc.

---

## 7. Date Formatting Helpers

Limited date formatting utilities exposed.

**Missing Methods:**
```typescript
// Format a date using the calendar's locale
formatDate: (
  date: string | Temporal.PlainDate,
  options?: Intl.DateTimeFormatOptions
) => string

// Format a date range
formatDateRange: (
  start: string | Temporal.PlainDate,
  end: string | Temporal.PlainDate,
  options?: Intl.DateTimeFormatOptions
) => string

// Format time (for day view)
formatTime: (
  time: string | Temporal.PlainDateTime,
  options?: Intl.DateTimeFormatOptions
) => string

// Get relative date string (today, tomorrow, etc.)
getRelativeDateLabel: (date: string | Temporal.PlainDate) => string
```

**Use Case:** Consistent date formatting using the calendar's locale settings.

---

## 8. Week/Month Boundary Helpers

No easy access to week/month boundaries.

**Missing Methods:**
```typescript
// Get first day of week for a date
getFirstDayOfWeek: (date?: string | Temporal.PlainDate) => string

// Get last day of week for a date
getLastDayOfWeek: (date?: string | Temporal.PlainDate) => string

// Get first day of month for a date
getFirstDayOfMonth: (date?: string | Temporal.PlainDate) => string

// Get last day of month for a date
getLastDayOfMonth: (date?: string | Temporal.PlainDate) => string

// Get week number for a date
getWeekNumber: (date?: string | Temporal.PlainDate) => number
```

**Use Case:** Week/month navigation, period calculations, etc.

---

## 9. Event Validation

No way to validate if events can be added or if they conflict.

**Missing Methods:**
```typescript
// Check if an event conflicts with existing events
hasEventConflict: (event: TEvent) => boolean

// Get conflicting events
getConflictingEvents: (event: TEvent) => TEvent[]

// Validate event (check overlaps, range constraints, etc.)
validateEvent: (event: TEvent) => {
  valid: boolean
  errors: string[]
}

// Check if a time slot is available
isTimeSlotAvailable: (
  start: string | Temporal.PlainDateTime,
  end: string | Temporal.PlainDateTime,
  excludeEventId?: Event['id']
) => boolean
```

**Use Case:** Event creation/editing validation, conflict detection, availability checks.

---

## 10. Calendar State Utilities

Limited access to calendar state and configuration.

**Missing Methods:**
```typescript
// Get current locale
getLocale: () => string

// Get current timezone
getTimezone: () => string

// Get week start day
getWeekStartsOn: () => number

// Check if a date is today
isToday: (date: string | Temporal.PlainDate) => boolean

// Check if a date is in the current period
isInCurrentPeriod: (date: string | Temporal.PlainDate) => boolean

// Check if a date is within the allowed range
isDateInRange: (date: string | Temporal.PlainDate) => boolean

// Get calendar configuration
getConfig: () => {
  locale: string
  timeZone: string
  weekStartsOn: number
  range: DateRange | null
}
```

**Use Case:** Conditional rendering, validation, UI state management.

---

## 11. Navigation Helpers

Additional navigation utilities beyond basic period navigation.

**Missing Methods:**
```typescript
// Go to a specific date (alias for goToSpecificPeriod with better naming)
goToDate: (date: string | Temporal.PlainDate) => void

// Go to today (alias for goToCurrentPeriod)
goToToday: () => void

// Navigate by a specific number of periods
navigatePeriods: (count: number) => void

// Get navigation history (for back/forward)
getNavigationHistory: () => string[]
goBack: () => void
goForward: () => void
```

**Use Case:** More flexible navigation, history tracking, etc.

---

## 12. Event Grouping and Layout

Utilities for event layout calculations (overlapping, stacking, etc.).

**Missing Methods:**
```typescript
// Get events grouped by date
getEventsGroupedByDate: () => Map<string, TEvent[]>

// Calculate event layout for day view (for overlapping events)
calculateEventLayout: (
  events: TEvent[],
  options?: {
    minWidth?: number
    maxColumns?: number
  }
) => Array<{
  event: TEvent
  column: number
  span: number
  position: { top: string; height: string; left: string; width: string }
}>

// Get event stacking information
getEventStacking: (events: TEvent[]) => {
  maxStackHeight: number
  stacks: Array<{
    events: TEvent[]
    column: number
  }>
}
```

**Use Case:** Advanced event rendering, overlapping event layouts, column calculations.

---

## 13. Date Range Utilities

Helpers for working with date ranges in the context of the calendar.

**Missing Methods:**
```typescript
// Get all dates in current period
getDatesInPeriod: () => Temporal.PlainDate[]

// Get dates in a range
getDatesInRange: (start: string, end: string) => Temporal.PlainDate[]

// Check if a date range overlaps with any events
hasEventsInRange: (start: string, end: string) => boolean

// Get date range for current view
getViewDateRange: () => {
  start: string
  end: string
  dates: Temporal.PlainDate[]
}
```

**Use Case:** Range selection, bulk operations, period calculations.

---

## 14. Event Time Utilities

Time-related calculations for events.

**Missing Methods:**
```typescript
// Get event duration in minutes/hours
getEventDuration: (event: TEvent) => {
  minutes: number
  hours: number
  formatted: string
}

// Check if event spans multiple days
isMultiDayEvent: (event: TEvent) => boolean

// Get all days an event spans
getEventDays: (event: TEvent) => Temporal.PlainDate[]

// Check if event is all-day
isAllDayEvent: (event: TEvent) => boolean

// Get event time range as formatted string
getEventTimeRange: (event: TEvent) => string
```

**Use Case:** Event display, duration calculations, multi-day event handling.

---

## 15. Callbacks and Event Handlers

No way to react to calendar state changes.

**Missing Options:**
```typescript
// In CalendarCoreOptions
onViewModeChange?: (viewMode: ViewMode) => void
onPeriodChange?: (period: string) => void
onEventAdd?: (event: TEvent) => void
onEventUpdate?: (event: TEvent) => void
onEventDelete?: (id: Event['id']) => void
onDateSelect?: (date: string) => void
```

**Use Case:** Side effects, analytics, external state synchronization.

---

## Summary

The current `useCalendar` hook provides basic calendar functionality but lacks many utilities that developers commonly need. The most critical missing pieces are:

1. **Event Management** - Dynamic add/update/delete
2. **Formatting Utilities** - Period display, date formatting
3. **Time Calculations** - Day view positioning
4. **Event Querying** - Filtering and searching events
5. **Period Boundaries** - Start/end date helpers
6. **Validation** - Event conflict detection

These additions would significantly improve the developer experience and reduce the need for manual implementations like those seen in the example code.
