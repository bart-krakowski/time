import { Temporal } from '@js-temporal/polyfill'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { useDatePicker } from '../useDatePicker/useDatePicker'

describe('useDatePicker', () => {
  test('should initialize with the given initial date', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const { result } = renderHook(() => useDatePicker({ selectedDate }))

    expect(result.current.selectedDate).toEqual(selectedDate)
  })

  test('should allow selecting a date within the min and max range', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() =>
      useDatePicker({ selectedDate, minDate, maxDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(newDate)
  })

  test('should not allow selecting a date before the min date', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const { result } = renderHook(() => useDatePicker({ selectedDate, minDate }))

    const newDate = Temporal.PlainDate.from('2024-04-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(selectedDate)
  })

  test('should not allow selecting a date after the max date', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() => useDatePicker({ selectedDate, maxDate }))

    const newDate = Temporal.PlainDate.from('2024-08-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(selectedDate)
  })

  test('should call onSelectDate when a valid date is selected', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const onSelectDate = vi.fn()
    const { result } = renderHook(() =>
      useDatePicker({ selectedDate, onSelectDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(onSelectDate).toHaveBeenCalledWith(newDate)
  })

  test('should render array of days', () => {
    const selectedDate = Temporal.PlainDate.from('2024-06-01')
    const { result } = renderHook(() => useDatePicker({ selectedDate }))

    const days = result.current.days.flat()
    expect(days.length).toBeGreaterThan(0)
    expect(days[0]).toEqual({
      date: Temporal.PlainDate.from('2024-05-26'),
      isToday: false,
      isSelected: true,
    })

    expect(days[days.length - 1]?.date.toString()).toBe('2024-06-30')
  })
})
