import { useCallback, useMemo } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { useDatePickerReducer } from './useDatePickerReducer'
import { actions } from './useDatePickerActions'
import type { UseDatePickerAction} from './useDatePickerActions';
import type { UseDatePickerState } from './useDatePickerState'

/**
 * Generates chunks of an array.
 * @param arr - The array to chunk.
 * @param n - The size of each chunk.
 * @returns A generator that yields chunks of the array.
 */
const getChunks = function* <T>(arr: T[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

/**
 * Generates a date range between the start and end dates.
 * @param start - The start date.
 * @param end - The end date.
 * @returns An array of dates between the start and end dates.
 */
const generateDateRange = (
  start: Temporal.PlainDate,
  end: Temporal.PlainDate,
) => {
  const dates: Temporal.PlainDate[] = []
  let current = start
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    dates.push(current)
    current = current.add({ days: 1 })
  }
  return dates
}

/**
 * Gets the first day of the month for a given month string.
 * @param currMonth - The month string in 'YYYY-MM' format.
 * @returns The first day of the month as a Temporal.PlainDate.
 */
const getFirstDayOfMonth = (currMonth: string) =>
  Temporal.PlainDate.from(`${currMonth}-01`)

interface UseDatePickerBaseProps<TState extends UseDatePickerState = UseDatePickerState> {
  /**
   * The minimum selectable date in the date picker.
   */
  minDate?: Temporal.PlainDate | null
  /**
   * The maximum selectable date in the date picker.
   */
  maxDate?: Temporal.PlainDate | null
  /**
   * Callback function that is called when a date is selected.
   */
  onSelectDate?: (date: Temporal.PlainDate) => void
  /**
   * The locale for formatting dates.
   */
  locale?: string
  /**
   * The initially selected dates.
   */
  selectedDates?: Temporal.PlainDate[] | null
  /**
   * The first day of the week (1 for Monday, 7 for Sunday).
   * @default 1
   */
  weekStartsOn?: number
  /**
   * Custom reducer function to manage the state of the date picker.
   */
  reducer?: <TAction extends UseDatePickerAction>(state: TState, action: TAction) => TState
}

type UseDatePickerProps = 
| (UseDatePickerBaseProps & { multiple?: boolean; range?: never | false })
| (UseDatePickerBaseProps & { multiple?: never | false; range?: boolean })

/**
 * Hook to manage the state and behavior of a date picker.
 *
 * @param {UseDatePickerProps} props - The configuration properties for the date picker.
 * @param {Temporal.PlainDate[]} [props.selectedDates=null] - The initially selected dates.
 * @param {Temporal.PlainDate} [props.minDate=null] - The minimum selectable date.
 * @param {Temporal.PlainDate} [props.maxDate=null] - The maximum selectable date.
 * @param {Function} [props.onSelectDate] - Callback function called when a date is selected.
 * @param {string} [props.locale='en-US'] - The locale for formatting dates.
 * @param {boolean} [props.multiple=false] - Whether multiple dates can be selected.
 * @param {boolean} [props.range=false] - Whether a range of dates can be selected.
 * @param {number} [props.weekStartsOn=1] - The first day of the week (1 for Monday, 7 for Sunday).
 * @param {Function} [props.reducer] - Custom reducer function to manage the state of the date picker.
 *
 * @returns {Object} datePickerState - The state and functions for managing the date picker.
 * @returns {Temporal.PlainDate[]} datePickerState.selectedDates - The currently selected dates.
 * @returns {Temporal.PlainDate} datePickerState.minDate - The minimum selectable date.
 * @returns {Temporal.PlainDate} datePickerState.maxDate - The maximum selectable date.
 * @returns {Temporal.PlainDate} datePickerState.currPeriod - The current displayed period (month).
 * @returns {boolean} datePickerState.multiple - Whether multiple dates can be selected.
 * @returns {boolean} datePickerState.range - Whether a range of dates can be selected.
 * @returns {Array} datePickerState.weeks - An array representing the weeks in the current month, each containing day objects with various properties.
 * @returns {Array} datePickerState.daysNames - An array of day names based on the locale and week start day.
 * @returns {Function} datePickerState.selectDate - Function to select a date.
 * @returns {Function} datePickerState.goToPreviousPeriod - Function to navigate to the previous period (month).
 * @returns {Function} datePickerState.goToNextPeriod - Function to navigate to the next period (month).
 * @returns {Function} datePickerState.goToCurrentPeriod - Function to navigate to the current period (month).
 * @returns {Function} datePickerState.goToSpecificPeriod - Function to navigate to a specific period (month).
 */
export const useDatePicker = ({
  selectedDates = null,
  minDate = null,
  maxDate = null,
  onSelectDate,
  locale = 'en-US',
  multiple = false,
  range = false,
  weekStartsOn = 1,
  reducer,
}: UseDatePickerProps) => {
  if (maxDate && minDate && Temporal.PlainDate.compare(minDate, maxDate) > 0) {
    throw new Error('The min date cannot be after the max date')
  }

  const [state, dispatch] = useDatePickerReducer({
    selectedDates: selectedDates,
    minDate,
    maxDate,
    currPeriod: Temporal.Now.plainDateISO(),
    multiple,
    range,
  }, reducer)

  const firstDayOfMonth = getFirstDayOfMonth(
    state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
  )

  const weeks = useMemo(() => 
    Array.from(
      getChunks(
        generateDateRange(
          firstDayOfMonth.subtract({ days: (firstDayOfMonth.dayOfWeek - weekStartsOn + 7) % 7 }),
          firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 }),
        ),
        7,
      ),
    ).map((week) =>
      week.map((day) => {
        const isSelected = state.selectedDates
          ? state.selectedDates.some(
              (selectedDate) =>
                Temporal.PlainDate.compare(day, selectedDate) === 0,
            )
          : false

        const isInRange = 
          state.selectedDates?.[0] && state.selectedDates[1]
            ? Temporal.PlainDate.compare(day, state.selectedDates[0]) >= 0 &&
              Temporal.PlainDate.compare(day, state.selectedDates[1]) <= 0
            : false

        const isInCurrentPeriod = day.month === state.currPeriod.month

        return {
          date: day,
          isToday:
            Temporal.PlainDate.compare(day, Temporal.Now.plainDateISO()) === 0,
          isSelected,
          isInCurrentPeriod,
          ...(range && { isInRange }),
        }
      }),
    ), [firstDayOfMonth, weekStartsOn, state.selectedDates, state.currPeriod.month, range]
  )

  const selectDate = useCallback(
    (date: Temporal.PlainDate) => {
      dispatch(actions.setDate(date))
      onSelectDate?.(date)
    },
    [dispatch, onSelectDate],
  )

  const goToPreviousPeriod = useCallback(() => {
    dispatch(actions.goToPreviousPeriod())
  }, [dispatch])

  const goToNextPeriod = useCallback(() => {
    dispatch(actions.goToNextPeriod())
  }, [dispatch])

  const goToCurrentPeriod = useCallback(() => {
    dispatch(actions.goToCurrentPeriod())
  }, [dispatch])

  const goToSpecificPeriod = useCallback((date: Temporal.PlainDate) => {
      dispatch(actions.goToSpecificPeriod(date))
    },
    [dispatch],
  )

  const daysNames = useMemo(() => {
    const baseDate = Temporal.PlainDate.from('2024-01-01')
    return Array.from({ length: 7 }).map((_, i) => 
      baseDate.add({ days: (i + weekStartsOn - 1) % 7 })
        .toLocaleString(locale, { weekday: 'short' })
    )
  }, [locale, weekStartsOn])

  return {
    ...state,
    weeks,
    daysNames,
    selectDate,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
  }
}
