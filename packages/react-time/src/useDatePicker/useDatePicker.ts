import { useCallback } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { useDatePickerReducer } from './useDatePickerReducer'
import { actions } from './useDatePickerActions'

const getChunks = function* <T>(arr: T[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

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

const getFirstDayOfMonth = (currMonth: string) =>
  Temporal.PlainDate.from(`${currMonth}-01`)


interface UseDatePickerProps {
  minDate?: Temporal.PlainDate | null
  maxDate?: Temporal.PlainDate | null
  onSelectDate?: (date: Temporal.PlainDate) => void
  locale?: string
  multiple?: boolean
  range?: boolean
  selectedDate?: Temporal.PlainDate | null
}

export const useDatePicker = ({
  selectedDate = null,
  minDate = null,
  maxDate = null,
  onSelectDate,
  locale = 'en-US',
  multiple = false,
  range = false,
}: UseDatePickerProps) => {
  const [state, dispatch] = useDatePickerReducer({
    selectedDate: selectedDate,
    minDate,
    maxDate,
    currPeriod: Temporal.Now.plainDateISO(),
    multiple,
    range,
  })

  const firstDayOfMonth = getFirstDayOfMonth(
    state.currPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
  )

  const days = Array.from(
    getChunks(
      generateDateRange(
        firstDayOfMonth,
        firstDayOfMonth.add({ months: 1 }).subtract({ days: 1 }),
      ),
      7,
    )
  ).map((week) =>
    week.map((day) => ({
      date: day,
      isToday: Temporal.PlainDate.compare(day, Temporal.Now.plainDateISO()) === 0,
      isSelected: state.selectedDate ? Temporal.PlainDate.compare(day, state.selectedDate) === 0 : false,
    })),
  )

  const selectDate = useCallback(
    (date: Temporal.PlainDate) => {
     
      dispatch(actions.setDate(date))
      if (onSelectDate) onSelectDate(date)
    },
    [dispatch, onSelectDate],
  )

  const getPrev = useCallback(() => {
    dispatch(actions.setCurrentPeriod())
  }, [dispatch])

  const getNext = useCallback(() => {
    dispatch(actions.setCurrentPeriod())
  }, [dispatch])

  const getCurrent = useCallback(() => {
    dispatch(actions.setCurrentPeriod())
  }, [dispatch])

  const get = useCallback(() => {
    dispatch(actions.setCurrentPeriod())
  }, [dispatch])

  return {
    ...state,
    days,
    daysNames: days
      .flat()
      .map((day) => day.date.toLocaleString(locale, { weekday: 'short' })),
    selectDate,
    getPrev,
    getNext,
    getCurrent,
    get,
  }
}
