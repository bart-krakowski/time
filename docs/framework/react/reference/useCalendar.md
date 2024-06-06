---
title: Use Calendar
id: useCalendar
---

### `useCalendar`

```tsx
export function useCalendar({
  weekStartsOn,
  events,
  viewMode,
  locale,
  onChangeViewMode,
}: UseCalendarProps)
```

`useCalendar` is a hook that provides a comprehensive set of functionalities for managing calendar events, view modes, and period navigation.


#### Parameters

- `weekStartsOn?: number`
  - This parameter is an optional number that specifies the day of the week that the calendar should start on. It defaults to 0, which is Sunday.
- `events: Event[]`
  - This parameter is an array of events that the calendar should display.
- `viewMode: 'month' | 'week' | number`
  - This parameter is a string that specifies the initial view mode of the calendar. It can be either 'month', 'week', or a number representing the number of days in a custom view mode.
- `locale?: string`
  - This parameter is an optional string that specifies the locale to use for formatting dates and times. It defaults to the system locale.
- `onChangeViewMode?: (viewMode: 'month' | 'week' | number) => void`
  - This parameter is an optional callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
- `onChangeViewMode?: (viewMode: 'month' | 'week' | number) => void`
  - This parameter is an optional callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
- `reducer?: (state: CalendarState, action: CalendarAction) => CalendarState`
  - This parameter is an optional custom reducer function that can be used to manage the state of the calendar.


#### Returns

- `firstDayOfPeriod: Temporal.PlainDate`
  - This value represents the first day of the current period displayed by the calendar.
- `currPeriod: string`
  - This value represents a string that describes the current period displayed by the calendar.
- `goToPreviousPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the previous period.
- `goToNextPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the next period.
- `goToCurrentPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the current period.
- `goToSpecificPeriod: (date: Temporal.PlainDate) => void`
  - This function is a callback function that is called when a date is selected in the calendar. It receives the selected date as an argument.
- `weeks: Array<Array<{ date: Temporal.PlainDate; events: Event[] }>>`
  - This value represents the calendar grid, where each cell contains the date and events for that day.
- `daysNames: string[]`
  - This value represents an array of strings that contain the names of the days of the week.
- `viewMode: 'month' | 'week' | number`
  - This value represents the current view mode of the calendar.
- `changeViewMode: (newViewMode: 'month' | 'week' | number) => void`
  - This function is used to change the view mode of the calendar.
- `getEventProps: (id: string) => { style: CSSProperties } | null`
  - This function is used to retrieve the style properties for a specific event based on its ID.
- `getEventProps: (id: string) => { style: CSSProperties } | null`
  - This function is used to retrieve the style properties for a specific event based on its ID.
- `getEventProps: (id: string) => { style: CSSProperties } | null`
  - This function is used to retrieve the style properties for a specific event based on its ID.
- `currentTimeMarkerProps: () => { style: CSSProperties, currentTime: Temporal.PlainTime }`
  - This function is used to retrieve the style properties and current time for the current time marker.
- `isPending: boolean`
  - This value represents whether the calendar is in a pending state.


#### Example Usage

```tsx
const CalendarComponent = ({ events }) => {
  const {
    firstDayOfPeriod,
    currPeriod,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
    changeViewMode,
    weeks,
    daysNames,
    viewMode,
    getEventProps,
    currentTimeMarkerProps,
  } = useCalendar({
    events,
    viewMode: 'month',
    locale: 'en-US',
    onChangeViewMode: (newViewMode) => console.log('View mode changed:', newViewMode),
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPreviousPeriod}>Previous</button>
        <button onClick={goToCurrentPeriod}>Today</button>
        <button onClick={goToNextPeriod}>Next</button>
      </div>
      <div className="calendar-view-mode">
        <button onClick={() => changeViewMode('month')}>Month View</button>
        <button onClick={() => changeViewMode('week')}>Week View</button>
        <button onClick={() => changeViewMode(3)}>3-Day View</button>
        <button onClick={() => changeViewMode(1)}>1-Day View</button>
      </div>
      <table className="calendar-table">
        {viewMode === 'month' && (
          <thead>
            <tr>
              {daysNames.map((dayName, index) => (
                <th key={index} className="calendar-day-name">
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="calendar-week">
              {week.map((day) => (
                <td key={day.date.toString()} className={`
                  calendar-day
                  ${day.isToday ? 'today' : ''}
                  ${day.isInCurrentPeriod ? 'current' : ''}
                `}>
                  <div className="calendar-date">
                    {day.date.day}
                  </div>
                  <div className="calendar-events">
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="calendar-event"
                        {...getEventProps(event.id)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
              <div className="current-time-marker" {...currentTimeMarkerProps()}></div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```
