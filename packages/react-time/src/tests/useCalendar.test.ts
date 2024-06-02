import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCalendar } from '../useCalendar'

describe('useCalendar', () => {
  const events = [
    {
      id: '1',
      startDate: Temporal.PlainDateTime.from('2024-06-01T10:00:00'),
      endDate: Temporal.PlainDateTime.from('2024-06-01T12:00:00'),
      title: 'Event 1',
    },
    {
      id: '2',
      startDate: Temporal.PlainDateTime.from('2024-06-02T14:00:00'),
      endDate: Temporal.PlainDateTime.from('2024-06-02T16:00:00'),
      title: 'Event 2',
    },
  ]

  const mockEvent = {} as React.MouseEvent<HTMLButtonElement, MouseEvent>

  test('should initialize with the correct view mode and current period', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )
    expect(result.current.viewMode).toBe('month')
    expect(result.current.currPeriod).toBe(
      Temporal.Now.plainDateISO()
        .toString({ calendarName: 'auto' })
    )
  })

  test('should navigate to the previous period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )

    act(() => {
      result.current.getPrev(mockEvent)
    })

    const expectedPreviousMonth = Temporal.Now.plainDateISO().subtract({ months: 1 });
    const expectedFirstDayOfPreviousMonth = Temporal.PlainDate.from({
      year: expectedPreviousMonth.year,
      month: expectedPreviousMonth.month,
      day: 1,
    });

    expect(result.current.firstDayOfPeriod).toEqual(expectedFirstDayOfPreviousMonth);
  })

  test('should navigate to the next period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )

    act(() => {
      result.current.getNext(mockEvent)
    })

    const expectedNextMonth = Temporal.Now.plainDateISO().add({ months: 1 });
    const expectedFirstDayOfNextMonth = Temporal.PlainDate.from({
      year: expectedNextMonth.year,
      month: expectedNextMonth.month,
      day: 1,
    });

    expect(result.current.firstDayOfPeriod).toEqual(expectedFirstDayOfNextMonth);
  })

  test('should reset to the current period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )

    act(() => {
      result.current.getNext(mockEvent)
      result.current.getCurrent(mockEvent)
    })

    expect(result.current.currPeriod).toBe(
      Temporal.Now.plainDateISO().toString({ calendarName: 'auto' })
    )
  })

  test('should change view mode correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )

    act(() => {
      result.current.changeViewMode('week')
    })

    expect(result.current.viewMode).toBe('week')
  })

  test('should select a day correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'month' }),
    )

    act(() => {
      result.current.get(Temporal.PlainDate.from('2024-06-01'))
    })

    expect(result.current.currPeriod).toBe('2024-06-01')
  })

  test('should return the correct props for an event', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: 'week' }),
    )

    const eventProps = result.current.getEventProps('1')

    expect(eventProps).toEqual({
      style: {
        position: 'absolute',
        top: 'min(41.66666666666667%, calc(100% - 55px))',
        left: '2%',
        width: '96%',
        margin: 0,
        height: '8.333333333333332%',
      },
    })
  })
})
