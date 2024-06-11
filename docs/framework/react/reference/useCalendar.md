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
- `onChangeViewMode?: ({ value: number; unit: "month" | "week" | "day"; }) => void`
  - This parameter is an optional callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
- `onChangeViewMode?: (viewMode: value: number; unit: "month" | "week" | "day";) => void`
  - This parameter is an optional callback function that is called when the view mode of the calendar changes. It receives the new view mode as an argument.
- `reducer?: (state: CalendarState, action: CalendarAction) => CalendarState`
  - This parameter is an optional custom reducer function that can be used to manage the state of the calendar.


#### Returns

- `firstDayOfPeriod: Temporal.PlainDate`
  - This value represents the first day of the current period displayed by the calendar.
- `currentPeriod: string`
  - This value represents a string that describes the current period displayed by the calendar.
- `goToPreviousPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the previous period.
- `goToNextPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the next period.
- `goToCurrentPeriod: MouseEventHandler<HTMLButtonElement>`
  - This function is a click event handler that navigates to the current period.
- `goToSpecificPeriod: (date: Temporal.PlainDate) => void`
  - This function is a callback function that is called when a date is selected in the calendar. It receives the selected date as an argument.
- `days: Day[]`
  - This value represents an array of days in the current period displayed by the calendar.
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
- `getCurrentTimeMarkerProps: () => { style: CSSProperties, currentTime: Temporal.PlainTime }`
  - This function is used to retrieve the style properties and current time for the current time marker.
- `isPending: boolean`
  - This value represents whether the calendar is in a pending state.
- `groupDaysBy: ({ days: Day[], unit: 'week' | 'month', fillMissingDays?: boolean }) => Day[][]`
  - This function is used to group the days in the current period by a specified unit. The `fillMissingDays` parameter can be used to fill in missing days with previous or next month's days.

#### Example Usage

```tsx
const CalendarComponent = ({ events }) => {
  const {
    firstDayOfPeriod,
    currentPeriod,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
    changeViewMode,
    days,
    daysNames,
    viewMode,
    getEventProps,
    getCurrentTimeMarkerProps,
    groupDaysBy,
  } = useCalendar({
    weekStartsOn: 1,
    viewMode: { value: 1, unit: 'month' },
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
        <button onClick={() => changeViewMode({ value: 1, unit: 'month' })}>Month View</button>
        <button onClick={() => changeViewMode({ value: 1, unit: 'week' })}>Week View</button>
        <button onClick={() => changeViewMode({ value: 3, unit: 'day' })}>3-Day View</button>
        <button onClick={() => changeViewMode({ value: 1, unit: 'day' })}>1-Day View</button>
      </div>
      <table className="calendar-table">
        {viewMode.unit === 'month' && (
          groupDaysBy(days, 'months').map((month, monthIndex) => (
            <tbody key={monthIndex} className="calendar-month">
              <tr>
                <th colSpan={7} className="calendar-month-name">
                  {month[0]?.date.toLocaleString('default', { month: 'long' })}{' '}
                  {month[0]?.date.year}
                </th>
              </tr>
              <tr>
                {daysNames.map((dayName, index) => (
                  <th key={index} className="calendar-day-name">
                    {dayName}
                  </th>
                ))}
              </tr>
              {groupDaysBy(month, 'weeks').map((week, weekIndex) => (
                <tr key={weekIndex} className="calendar-week">
                  {week.map((day) => (
                    <td
                      key={day.date.toString()}
                      className={`calendar-day ${day.isToday ? 'today' : ''
                        } ${day.isInCurrentPeriod ? 'current' : 'not-current'}`}
                    >
                      <div className="calendar-date">{day.date.day}</div>
                      <div className="calendar-events">
                        {day.events.map((event) => (
                          <div
                            key={event.id}
                            className="calendar-event"
                            style={getEventProps(event.id)?.style}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))
        )}

        {viewMode.unit === 'week' && (
          <tbody className="calendar-week">
            <tr>
              {daysNames.map((dayName, index) => (
                <th key={index} className="calendar-day-name">
                  {dayName}
                </th>
              ))}
            </tr>
            {groupDaysBy(days, 'weeks').map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day) => (
                  <td
                    key={day.date.toString()}
                    className={`calendar-day ${day.isToday ? 'today' : ''
                      } ${day.isInCurrentPeriod ? 'current' : 'not-current'}`}
                  >
                    <div className="calendar-date">{day.date.day}</div>
                    <div className="calendar-events">
                      {day.events.map((event) => (
                        <div
                          key={event.id}
                          className="calendar-event"
                          style={getEventProps(event.id)?.style}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}

        {viewMode.unit === 'day' && (
          <tbody className="calendar-day">
            <tr>
              {daysNames.map((dayName, index) => (
                <th key={index} className="calendar-day-name">
                  {dayName}
                </th>
              ))}
            </tr>
            <tr>
              {days.map((day) => (
                <td
                  key={day.date.toString()}
                  className={`calendar-day ${day.isToday ? 'today' : ''
                    } ${day.isInCurrentPeriod ? 'current' : 'not-current'}`}
                >
                  <div className="calendar-date">{day.date.day}</div>
                  <div className="calendar-events">
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="calendar-event"
                        style={getEventProps(event.id)?.style}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};
```
