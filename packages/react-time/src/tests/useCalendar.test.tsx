import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCalendar } from '../useCalendar'

describe('useCalendar', () => {
  const events = [
    {
      id: '1',
      start: Temporal.PlainDateTime.from('2024-06-01T10:00:00'),
      end: Temporal.PlainDateTime.from('2024-06-01T12:00:00'),
      title: 'Event 1',
    },
    {
      id: '2',
      start: Temporal.PlainDateTime.from('2024-06-02T14:00:00'),
      end: Temporal.PlainDateTime.from('2024-06-02T16:00:00'),
      title: 'Event 2',
    },
  ]

  test('should initialize with the correct view mode and current period', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )
    expect(result.current.viewMode).toEqual({ value: 1, unit: 'month' })
    expect(result.current.currentPeriod.toString()).toBe(
      Temporal.Now.plainDateISO().toString(),
    )
  })

  test('should navigate to the previous period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )

    act(() => {
      result.current.goToPreviousPeriod()
    })

    const expectedPreviousMonth = Temporal.Now.plainDateISO().subtract({
      months: 1,
    })

    expect(result.current.currentPeriod).toEqual(
      expectedPreviousMonth,
    )
  })

  test('should navigate to the next period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )

    act(() => {
      result.current.goToNextPeriod()
    })

    const expectedNextMonth = Temporal.Now.plainDateISO().add({ months: 1 })

    expect(result.current.currentPeriod).toEqual(expectedNextMonth)
  })

  test('should change view mode correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )

    act(() => {
      result.current.changeViewMode({ value: 1, unit: 'week' })
    })

    expect(result.current.viewMode).toEqual({ value: 1, unit: 'week' })
  })

  test('should select a day correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )

    act(() => {
      result.current.goToSpecificPeriod(Temporal.PlainDate.from('2024-06-01'))
    })

    expect(result.current.currentPeriod.toString()).toBe('2024-06-01')
  })

  test('should return the correct props for an event', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'week' } }),
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

  test('should return the correct props for overlapping events', () => {
    const overlappingEvents = [
      {
        id: '1',
        start: Temporal.PlainDateTime.from('2024-06-01T10:00:00'),
        end: Temporal.PlainDateTime.from('2024-06-01T12:00:00'),
        title: 'Event 1',
      },
      {
        id: '2',
        start: Temporal.PlainDateTime.from('2024-06-01T11:00:00'),
        end: Temporal.PlainDateTime.from('2024-06-01T13:00:00'),
        title: 'Event 2',
      },
    ]
    const { result } = renderHook(() =>
      useCalendar({ events: overlappingEvents, viewMode: { value: 1, unit: 'week' } }),
    )

    const event1Props = result.current.getEventProps('1')
    const event2Props = result.current.getEventProps('2')

    expect(event1Props).toEqual({
      style: {
        position: 'absolute',
        top: 'min(41.66666666666667%, calc(100% - 55px))',
        left: '2%',
        width: '47%',
        margin: 0,
        height: '8.333333333333332%',
      },
    })

    expect(event2Props).toEqual({
      style: {
        position: 'absolute',
        top: 'min(45.83333333333333%, calc(100% - 55px))',
        left: '51%',
        width: '47%',
        margin: 0,
        height: '8.333333333333332%',
      },
    })
  })

  test('should render array of days', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' }),
    );

    const { days } = result.current;
    const weeks = result.current.groupDaysBy({ days, unit: 'week' });

    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toHaveLength(7);

    expect(weeks[0]?.[0]?.date.toString()).toBe('2024-05-27');
    expect(weeks[weeks.length - 1]?.[0]?.date.toString()).toBe('2024-06-24');
    expect(weeks.find((week) => week.some((day) => day?.isToday))?.find((day) => day?.isToday)?.date.toString()).toBe('2024-06-01');
  });

  test('should return the correct day names based on the locale', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    );

    const { daysNames } = result.current;
    expect(daysNames).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  test('should correctly mark days as in current period', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    );

    const { days } = result.current;
    const weeks = result.current.groupDaysBy({ days, unit: 'week' });
    const daysInCurrentPeriod = weeks.flat().map(day => day?.isInCurrentPeriod);

    expect(daysInCurrentPeriod).toEqual([
      false, false, false, false, false, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true
    ]);
  });

  test('should navigate to a specific period correctly', () => {
    const { result } = renderHook(() => useCalendar({ events, viewMode: { value: 1, unit: 'month' } }))
    const specificDate = Temporal.PlainDate.from('2024-05-15')

    act(() => {
      result.current.goToSpecificPeriod(specificDate)
    })

    expect(result.current.currentPeriod).toEqual(specificDate)
  })

  test('should navigate to the previous period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    )

    act(() => {
      result.current.goToPreviousPeriod()
    })

    const expectedPreviousMonth = Temporal.Now.plainDateISO().subtract({
      months: 1,
    })

    expect(result.current.currentPeriod).toEqual(expectedPreviousMonth)
  })

  test('should navigate to the next period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    )

    act(() => {
      result.current.goToNextPeriod()
    })

    const expectedNextMonth = Temporal.Now.plainDateISO().add({ months: 1 })

    expect(result.current.currentPeriod).toEqual(expectedNextMonth)
  })

  test('should reset to the current period correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    )

    act(() => {
      result.current.goToNextPeriod()
      result.current.goToCurrentPeriod()
    })

    expect(result.current.currentPeriod).toEqual(
      Temporal.Now.plainDateISO(),
    )
  })

  test('should group days by months correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 2, unit: 'month' }, locale: 'en-US' })
    );

    const { days, groupDaysBy } = result.current;
    const months = groupDaysBy({ days, unit: 'month' });

    expect(months).toHaveLength(2);
    expect(months[0]?.[0]?.date.toString()).toBe('2024-06-01');
    expect(months[1]?.[0]?.date.toString()).toBe('2024-07-01');
  });

  test('should group days by weeks correctly', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    );

    const { days, groupDaysBy } = result.current;
    const weeks = groupDaysBy({ days, unit: 'week' });
    expect(weeks).toHaveLength(5);
    expect(weeks[0]?.[0]?.date.toString()).toBe('2024-05-27');
    expect(weeks[4]?.[6]?.date.toString()).toBe('2024-06-30');
  });
});
