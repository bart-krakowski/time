# TanStack Time - API Usage Examples

## Vanilla TypeScript/JavaScript

### Basic Calendar

```typescript
import { Calendar } from '@tanstack/time-core'

const calendar = new Calendar({
  locale: 'en-US',
  timezone: 'America/New_York',
  firstDayOfWeek: 0, // Sunday
  initialView: 'month',
})

// Subscribe to state changes
calendar.subscribe((state) => {
  console.log('Calendar state:', state)
})

// Navigate
calendar.navigate('next') // Next month
calendar.navigate('prev') // Previous month
calendar.navigate('today') // Go to today

// Get calendar data
const days = calendar.getDays()
const weeks = calendar.getWeeks()
const months = calendar.getMonths()

// Change view
calendar.setView('week')
calendar.setView('year')
```

### Date Picker - Single Date

```typescript
import { DatePicker } from '@tanstack/time-core'

const datePicker = new DatePicker({
  mode: 'single',
  minDate: new Date(), // Can't select past dates
  onSelect: (date) => {
    console.log('Selected date:', date)
  },
})

datePicker.subscribe((state) => {
  console.log('DatePicker state:', state)
})

// Select a date
datePicker.selectDate(new Date('2024-12-25'))

// Check if date is selectable
const isSelectable = datePicker.isDateSelectable(new Date('2024-12-25'))

// Open/close
datePicker.open()
datePicker.close()
datePicker.toggle()
```

### Date Picker - Range

```typescript
const rangePicker = new DatePicker({
  mode: 'range',
  minDate: new Date(),
  onSelect: (range) => {
    console.log('Selected range:', range.start, range.end)
  },
})

// Select range
rangePicker.selectRange(
  new Date('2024-12-20'),
  new Date('2024-12-25')
)

// Or select interactively (first click sets start, second sets end)
rangePicker.selectDate(new Date('2024-12-20')) // Sets start
rangePicker.selectDate(new Date('2024-12-25')) // Sets end
```

### Date Picker - Multiple Dates

```typescript
const multiPicker = new DatePicker({
  mode: 'multiple',
  disabledDays: [0, 6], // Disable weekends
  onSelect: (dates) => {
    console.log('Selected dates:', dates)
  },
})

// Add dates
multiPicker.addDate(new Date('2024-12-20'))
multiPicker.addDate(new Date('2024-12-21'))
multiPicker.addDate(new Date('2024-12-22'))

// Remove date
multiPicker.removeDate(new Date('2024-12-21'))

// Or toggle
multiPicker.selectDate(new Date('2024-12-20')) // Adds if not selected, removes if selected
```

### Time Picker

```typescript
import { TimePicker } from '@tanstack/time-core'

const timePicker = new TimePicker({
  format: '12h', // or '24h'
  showSeconds: false,
  step: {
    hours: 1,
    minutes: 15, // 15-minute intervals
  },
  onSelect: (time) => {
    console.log('Selected time:', time)
  },
})

// Set time
timePicker.setTime(new Date('2024-12-20T14:30:00'))

// Or set individually
timePicker.setHour(2) // 2 PM in 12h format
timePicker.setMinute(30)
timePicker.setMeridiem('pm')

// Get available options
const hours = timePicker.getHours() // [1, 2, 3, ..., 12] for 12h
const minutes = timePicker.getMinutes() // [0, 15, 30, 45] based on step

// Get formatted time
const formatted = timePicker.getFormattedTime() // "2:30 PM"
```

### DateTime Picker

```typescript
import { DateTimePicker } from '@tanstack/time-core'

const dateTimePicker = new DateTimePicker({
  datePickerOptions: {
    mode: 'single',
    minDate: new Date(),
  },
  timePickerOptions: {
    format: '12h',
    step: { minutes: 15 },
  },
  initialDateTime: new Date('2024-12-20T14:30:00'),
  onSelect: (dateTime) => {
    console.log('Selected date/time:', dateTime)
  },
})

// Select date and time together
dateTimePicker.selectDateTime(
  new Date('2024-12-20'),
  new Date('2024-12-20T14:30:00')
)

// Or use individual pickers
dateTimePicker.datePicker.selectDate(new Date('2024-12-20'))
dateTimePicker.timePicker.setTime(new Date('2024-12-20T14:30:00'))
```

## React

### Basic Calendar Component

```tsx
import { useCalendar, useCalendarState } from '@tanstack/time-react'

function MyCalendar() {
  const calendar = useCalendar({
    locale: 'en-US',
    initialView: 'month',
  })
  
  const state = useCalendarState(calendar)
  const days = calendar.getDays()
  
  return (
    <div>
      <div>
        <button onClick={() => calendar.navigate('prev')}>Previous</button>
        <span>{state.focusedDate.toLocaleDateString()}</span>
        <button onClick={() => calendar.navigate('next')}>Next</button>
      </div>
      
      <div className="calendar-grid">
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`day ${day.isToday ? 'today' : ''} ${day.isCurrentMonth ? '' : 'other-month'}`}
          >
            {day.dayOfMonth}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Date Picker Component

```tsx
import { useCalendarDatePicker } from '@tanstack/time-react'

function MyDatePicker() {
  const { days, weeks, handleDayClick, datePickerState } = useCalendarDatePicker({
    calendarOptions: {
      locale: 'en-US',
    },
    datePickerOptions: {
      mode: 'single',
      minDate: new Date(),
      onSelect: (date) => {
        console.log('Selected:', date)
      },
    },
  })
  
  return (
    <div>
      <div className="selected-date">
        {datePickerState.selectedDate?.toLocaleDateString()}
      </div>
      
      <div className="calendar">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week">
            {week.days.map((day) => (
              <button
                key={day.date.toISOString()}
                onClick={() => handleDayClick(day)}
                disabled={day.isDisabled}
                className={`
                  day
                  ${day.isToday ? 'today' : ''}
                  ${day.isSelected ? 'selected' : ''}
                  ${day.isInRange ? 'in-range' : ''}
                `}
                aria-label={day.ariaLabel}
              >
                {day.dayOfMonth}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Time Picker Component

```tsx
import { useTimePicker, useTimePickerState } from '@tanstack/time-react'

function MyTimePicker() {
  const timePicker = useTimePicker({
    format: '12h',
    step: { minutes: 15 },
  })
  
  const state = useTimePickerState(timePicker)
  const hours = timePicker.getHours()
  const minutes = timePicker.getMinutes()
  
  return (
    <div>
      <div className="time-display">
        {state.selectedTime ? timePicker.getFormattedTime() : 'No time selected'}
      </div>
      
      <div className="time-selectors">
        <select
          value={state.hour ?? ''}
          onChange={(e) => timePicker.setHour(Number(e.target.value))}
        >
          <option value="">Hour</option>
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        
        <select
          value={state.minute ?? ''}
          onChange={(e) => timePicker.setMinute(Number(e.target.value))}
        >
          <option value="">Minute</option>
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {String(minute).padStart(2, '0')}
            </option>
          ))}
        </select>
        
        {state.meridiem && (
          <select
            value={state.meridiem}
            onChange={(e) => timePicker.setMeridiem(e.target.value as 'am' | 'pm')}
          >
            <option value="am">AM</option>
            <option value="pm">PM</option>
          </select>
        )}
      </div>
    </div>
  )
}
```

## Solid

```typescript
import { createCalendar, createDatePicker } from '@tanstack/time-solid'
import { createEffect } from 'solid-js'

function MyCalendar() {
  const calendar = createCalendar({
    locale: 'en-US',
    initialView: 'month',
  })
  
  const datePicker = createDatePicker({
    mode: 'single',
  })
  
  createEffect(() => {
    const days = calendar.getDays()
    console.log('Days:', days)
  })
  
  return (
    <div>
      <button onClick={() => calendar.navigate('prev')}>Prev</button>
      <button onClick={() => calendar.navigate('next')}>Next</button>
    </div>
  )
}
```

## Vue

```vue
<script setup lang="ts">
import { useCalendar, useDatePicker } from '@tanstack/time-vue'
import { computed } from 'vue'

const calendar = useCalendar({
  locale: 'en-US',
  initialView: 'month',
})

const datePicker = useDatePicker({
  mode: 'single',
})

const days = computed(() => calendar.getDays())
</script>

<template>
  <div>
    <button @click="calendar.navigate('prev')">Previous</button>
    <button @click="calendar.navigate('next')">Next</button>
    
    <div class="calendar-grid">
      <div
        v-for="day in days"
        :key="day.date.toISOString()"
        @click="datePicker.selectDate(day.date)"
        :class="{
          'today': day.isToday,
          'selected': day.isSelected,
          'disabled': day.isDisabled,
        }"
      >
        {{ day.dayOfMonth }}
      </div>
    </div>
  </div>
</template>
```

## Svelte

```svelte
<script lang="ts">
  import { createCalendar, createDatePicker } from '@tanstack/time-svelte'
  
  const calendar = createCalendar({
    locale: 'en-US',
    initialView: 'month',
  })
  
  const datePicker = createDatePicker({
    mode: 'single',
  })
  
  $: days = calendar.getDays()
</script>

<div>
  <button on:click={() => calendar.navigate('prev')}>Previous</button>
  <button on:click={() => calendar.navigate('next')}>Next</button>
  
  <div class="calendar-grid">
    {#each days as day (day.date.toISOString())}
      <button
        on:click={() => datePicker.selectDate(day.date)}
        disabled={day.isDisabled}
        class:today={day.isToday}
        class:selected={day.isSelected}
      >
        {day.dayOfMonth}
      </button>
    {/each}
  </div>
</div>
```

## Angular

```typescript
import { Component, OnInit } from '@angular/core'
import { CalendarService, DatePickerService } from '@tanstack/time-angular'

@Component({
  selector: 'app-calendar',
  template: `
    <div>
      <button (click)="prev()">Previous</button>
      <button (click)="next()">Next</button>
      
      <div class="calendar-grid">
        <button
          *ngFor="let day of days"
          (click)="selectDate(day.date)"
          [disabled]="day.isDisabled"
          [class.today]="day.isToday"
          [class.selected]="day.isSelected"
        >
          {{ day.dayOfMonth }}
        </button>
      </div>
    </div>
  `,
})
export class CalendarComponent implements OnInit {
  calendar = this.calendarService.create({
    locale: 'en-US',
    initialView: 'month',
  })
  
  datePicker = this.datePickerService.create({
    mode: 'single',
  })
  
  days = this.calendar.getDays()
  
  constructor(
    private calendarService: CalendarService,
    private datePickerService: DatePickerService
  ) {}
  
  ngOnInit() {
    this.calendar.subscribe(() => {
      this.days = this.calendar.getDays()
    })
  }
  
  prev() {
    this.calendar.navigate('prev')
  }
  
  next() {
    this.calendar.navigate('next')
  }
  
  selectDate(date: Date) {
    this.datePicker.selectDate(date)
  }
}
```
