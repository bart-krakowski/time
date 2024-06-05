import { Temporal } from '@js-temporal/polyfill'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useDatePicker } from '../useDatePicker/useDatePicker'

describe('useDatePicker', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('should initialize with the given initial date', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const { result } = renderHook(() => useDatePicker({ selectedDates }))

    expect(result.current.selectedDates).toEqual(selectedDates)
  })

  test('should allow selecting a date within the min and max range', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates, minDate, maxDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual([newDate])
  })

  test('should not allow selecting a date before the min date', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const { result } = renderHook(() => useDatePicker({ selectedDates, minDate }))

    const newDate = Temporal.PlainDate.from('2024-04-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual(selectedDates)
  })

  test('should not allow selecting a date after the max date', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() => useDatePicker({ selectedDates, maxDate }))

    const newDate = Temporal.PlainDate.from('2024-08-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual(selectedDates)
  })

  test('should call onSelectDate when a valid date is selected', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const onSelectDate = vi.fn()
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates, onSelectDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(onSelectDate).toHaveBeenCalledWith(newDate)
  })

  test('should render array of days', () => {
    vi.setSystemTime('2024-06-01')
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const { result } = renderHook(() => useDatePicker({ selectedDates }))

    const days = result.current.weeks.flat()
    expect(days.length).toBeGreaterThan(0)
    expect(days[0]).toEqual({
      date: Temporal.PlainDate.from('2024-05-31'),
      isToday: false,
      isSelected: false,
      isInCurrentPeriod: false,
    })

    expect(days[days.findIndex(day => day.date.equals(Temporal.PlainDate.from('2024-06-01')))]).toEqual({
      date: Temporal.PlainDate.from('2024-06-01'),
      isToday: true,
      isSelected: true,
      isInCurrentPeriod: true,
    })

    expect(days[days.length - 1]).toEqual({
      date: Temporal.PlainDate.from('2024-06-30'),
      isToday: false,
      isSelected: false,
      isInCurrentPeriod: true,
    })

    vi.useRealTimers()
  })
  
  test('should allow selecting multiple dates', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const { result } = renderHook(() => useDatePicker({ selectedDates, multiple: true }))

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual([Temporal.PlainDate.from('2024-06-01'), newDate])
  })

  test('should allow deselecting a date', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01'), Temporal.PlainDate.from('2024-06-15')]
    const { result } = renderHook(() => useDatePicker({ selectedDates, multiple: true }))

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual([Temporal.PlainDate.from('2024-06-01')])
  })

  test('should allow selecting a range of dates', () => {
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const { result } = renderHook(() => useDatePicker({ selectedDates, range: true }))

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDates).toEqual([Temporal.PlainDate.from('2024-06-01'), newDate])

    const days = result.current.weeks.flat()
    const selectedDatesIndex = days.findIndex((day) => day.date.equals(newDate))
    const rangeDates = days.slice(0, selectedDatesIndex + 1)
    rangeDates.forEach((day) => {
      expect(day.isInRange).toBe(true)
    })
  })

  test('should correctly mark days as in current period', () => {
    vi.setSystemTime('2024-06-01')
    const selectedDates = [Temporal.PlainDate.from('2024-06-01')]
    const { result } = renderHook(() => useDatePicker({ selectedDates, locale: 'en-US' }))

    const { weeks } = result.current
    const daysInCurrentPeriod = weeks.flat().map(day => day.isInCurrentPeriod)

    expect(daysInCurrentPeriod).toEqual([
      false, false, false, false, false, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
    ])
  })

  test('should return the correct day names based on weekStartsOn', () => {
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates: [], locale: 'en-US', weekStartsOn: 1 })
    )

    const { daysNames } = result.current
    expect(daysNames).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

    const { result: resultSundayStart } = renderHook(() =>
      useDatePicker({ selectedDates: [], locale: 'en-US', weekStartsOn: 7 })
    )

    const { daysNames: sundayDaysNames } = resultSundayStart.current
    expect(sundayDaysNames).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  test('should navigate to a specific period correctly', () => {
    const { result } = renderHook(() => useDatePicker({ selectedDates: [] }))
    const specificDate = Temporal.PlainDate.from('2024-05-15')

    act(() => {
      result.current.goToSpecificPeriod(specificDate)
    })

    expect(result.current.currPeriod).toEqual(specificDate)
  })

  test('should navigate to the previous period correctly', () => {
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates: [] }),
    )

    act(() => {
      result.current.goToPreviousPeriod()
    })

    const expectedPreviousMonth = Temporal.Now.plainDateISO().subtract({
      months: 1,
    })

    expect(result.current.currPeriod).toEqual(expectedPreviousMonth)
  })

  test('should navigate to the next period correctly', () => {
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates: [] }),
    )

    act(() => {
      result.current.goToNextPeriod()
    })

    const expectedNextMonth = Temporal.Now.plainDateISO().add({ months: 1 })

    expect(result.current.currPeriod).toEqual(expectedNextMonth)
  })

  test('should reset to the current period correctly', () => {
    const { result } = renderHook(() =>
      useDatePicker({ selectedDates: [] }),
    )

    act(() => {
      result.current.goToNextPeriod()
      result.current.goToCurrentPeriod()
    })

    expect(result.current.currPeriod).toEqual(
      Temporal.Now.plainDateISO(),
    )
  })
})
