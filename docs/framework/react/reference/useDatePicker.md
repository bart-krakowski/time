---
title: Use Date Picker
id: useDatePicker
---

### `useDatePicker`

```tsx
export const useDatePicker = ({
  initialDate = null,
  minDate,
  maxDate,
  onSelectDate,
}: UseDatePickerProps)
```

`useDatePicker` is a hook that provides functionality for managing date selection, including navigation between months and setting minimum and maximum selectable dates.


#### Parameters
- `initialDate` (optional): The initial date to display in the date picker. If not provided, the current date will be used.
  - This optional parameter specifies the initial date selected in the date picker. It defaults to null.
- `minDate` (optional): The minimum selectable date in the date picker. If not provided, there is no minimum date.
  - This optional parameter specifies the minimum selectable date in the date picker.
- `maxDate` (optional): The maximum selectable date in the date picker. If not provided, there is no maximum date.
  - This optional parameter specifies the maximum selectable date in the date picker.
- `onSelectDate` (optional): A callback function that is called when a date is selected.
  - This optional parameter specifies a callback function that is called when a date is selected.
- `reducer` (optional): A custom reducer function to manage the state of the date picker.
  - This optional parameter specifies a custom reducer function to manage the state of the date picker.


#### Returns
- `selectedDates`: The currently selected date.
  - This value represents the currently selected date.
- `minDate`: The minimum selectable date.
  - This value represents the minimum selectable date.
- `maxDate`: The maximum selectable date.
  - This value represents the maximum selectable date.
- `days`: The calendar grid for the current month.
  - This value represents the calendar grid for the current month, where each cell contains a date.
- `selectDate`: A function to select a date within the min and max range.
  - This function allows selecting a date within the min and max range.
- `goToPreviousPeriod`: A function to navigate to the previous month.
  - This function navigates to the previous month.
- `goToNextPeriod`: A function to navigate to the next month.
  - This function navigates to the next month.
- `goToCurrentPeriod`: A function to navigate to the current month.
  - This function navigates to the current month.
- `get`: A function to set the current period to a specified date.
  - This function sets the current period to a specified date.
- `daysNames`: An array of day names.
  - This value represents an array of day names.
  

#### Example
```tsx
const DatePickerComponent = () => {
  const {
    selectedDates,
    days,
    selectDate,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    daysNames,
  } = useDatePicker({
    selectedDates: [Temporal.PlainDate.from('2024-06-01')],
    minDate: Temporal.PlainDate.from('2024-01-01'),
    maxDate: Temporal.PlainDate.from('2024-12-31'),
    onSelectDate: (date) => console.log('Date selected:', date),
  });

  return (
    <div className="date-picker-container">
      <div className="date-picker-header">
        <button onClick={goToPreviousPeriod}>Previous</button>
        <button onClick={goToCurrentPeriod}>Today</button>
        <button onClick={goToNextPeriod}>Next</button>
      </div>
      <table className="date-picker-table">
        <thead>
          <tr>
            {daysNames.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day) => (
                <td
                  key={day.date.toString()}
                  className={day.isSelected ? 'selected' : ''}
                  onClick={() => selectDate(day.date)}
                >
                  {day.date.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```