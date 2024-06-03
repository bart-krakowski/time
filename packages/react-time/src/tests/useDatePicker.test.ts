import { Temporal } from '@js-temporal/polyfill'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { useDatePicker } from '../useDatePicker/useDatePicker'

describe('useDatePicker', () => {
  test('should initialize with the given initial date', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const { result } = renderHook(() => useDatePicker({ initialDate }))

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  test('should allow selecting a date within the min and max range', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() =>
      useDatePicker({ initialDate, minDate, maxDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(newDate)
  })

  test('should not allow selecting a date before the min date', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const minDate = Temporal.PlainDate.from('2024-05-01')
    const { result } = renderHook(() => useDatePicker({ initialDate, minDate }))

    const newDate = Temporal.PlainDate.from('2024-04-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  test('should not allow selecting a date after the max date', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const maxDate = Temporal.PlainDate.from('2024-07-01')
    const { result } = renderHook(() => useDatePicker({ initialDate, maxDate }))

    const newDate = Temporal.PlainDate.from('2024-08-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  test('should call onSelectDate when a valid date is selected', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const onSelectDate = vi.fn()
    const { result } = renderHook(() =>
      useDatePicker({ initialDate, onSelectDate }),
    )

    const newDate = Temporal.PlainDate.from('2024-06-15')
    act(() => {
      result.current.selectDate(newDate)
    })

    expect(onSelectDate).toHaveBeenCalledWith(newDate)
  })

  test('should render array of days', () => {
    const initialDate = Temporal.PlainDate.from('2024-06-01')
    const { result } = renderHook(() => useDatePicker({ initialDate }))

    const days = result.current.days.flat()
    expect(days.length).toBeGreaterThan(0)
    expect(days[0]?.toString()).toBe('2024-06-01')
    expect(days[days.length - 1]?.toString()).toBe('2024-06-30')
  })
})
