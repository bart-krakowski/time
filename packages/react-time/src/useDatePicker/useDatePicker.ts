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
  initialDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
  maxDate?: Temporal.PlainDate | null
  onSelectDate?: (date: Temporal.PlainDate) => void
  locale?: string
  // multiple: boolean
  // range: boolean
}

export const useDatePicker = ({
  initialDate = null,
  minDate = null,
  maxDate = null,
  onSelectDate,
  locale = 'en-US',
}: UseDatePickerProps) => {
  const [state, dispatch] = useDatePickerReducer({
    selectedDate: initialDate,
    minDate,
    maxDate,
    currPeriod: Temporal.Now.plainDateISO(),
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
      if ((state.minDate && Temporal.PlainDate.compare(date, state.minDate) < 0) || (state.maxDate && Temporal.PlainDate.compare(date, state.maxDate) > 0))
        return
      dispatch(actions.setDate(date))
      if (onSelectDate) onSelectDate(date)
    },
    [state.minDate, state.maxDate, dispatch, onSelectDate],
  )

  const getPrev = useCallback(() => {
    if (state.minDate && Temporal.PlainDate.compare(state.currPeriod.subtract({ months: 1 }), state.minDate) < 0) return

    dispatch(actions.setCurrentPeriod(state.currPeriod.subtract({ months: 1 })))
  }, [dispatch, state.currPeriod, state.minDate])

  const getNext = useCallback(() => {
    if (state.maxDate && Temporal.PlainDate.compare(state.currPeriod.add({ months: 1 }), state.maxDate) > 0) return

    dispatch(actions.setCurrentPeriod(state.currPeriod.add({ months: 1 })))
  }, [dispatch, state.currPeriod, state.maxDate])

  const getCurrent = useCallback(() => {
    dispatch(actions.setCurrentPeriod(Temporal.Now.plainDateISO()))
  }, [dispatch])

  const get = useCallback(() => {
    dispatch(actions.setCurrentPeriod(Temporal.Now.plainDateISO()))
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
