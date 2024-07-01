import { Temporal } from '@js-temporal/polyfill'
import { beforeEach, describe, expect, test, vi } from 'vitest'
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

  const mockDate = Temporal.PlainDate.from('2024-06-15');
  const mockDateTime = Temporal.PlainDateTime.from('2024-06-15T10:00');
  const mockTimeZone = 'America/New_York';

  beforeEach(() => {
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(mockDate);
    vi.spyOn(Temporal.Now, 'plainDateTimeISO').mockReturnValue(mockDateTime);
    vi.spyOn(Temporal.Now, 'zonedDateTime').mockReturnValue(Temporal.Now.zonedDateTime('gregory', mockTimeZone));
    vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(Temporal.Now.zonedDateTimeISO());
  });

  test('should initialize with the correct view mode and current period', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' } }),
    )
    expect(result.current.viewMode).toEqual({ value: 1, unit: 'month' })
    expect(result.current.currentPeriod.toString()).toBe(
      Temporal.Now.plainDateISO().withCalendar('gregory').toString(),
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
      eventHeightInMinutes: 120,
      isSplitEvent: false,
      overlappingEvents: [],
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
      eventHeightInMinutes: 120,
      isSplitEvent: false,
      overlappingEvents: overlappingEvents[1]
    })

    expect(event2Props).toEqual({
      eventHeightInMinutes: 120,
      isSplitEvent: false,
      overlappingEvents: overlappingEvents[0]
    })
  })

  test('should render array of days', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' }),
    );

    const { days } = result.current;
    const weeks = result.current.groupDaysBy({ days, unit: 'week' });

    expect(weeks).toHaveLength(6);
    expect(weeks[0]).toHaveLength(7);

    expect(weeks[0]?.[0]?.date.toString()).toBe('2024-05-26');
    expect(weeks[weeks.length - 1]?.[0]?.date.toString()).toBe('2024-06-30');
    expect(weeks.find((week) => week.some((day) => day?.isToday))?.find((day) => day?.isToday)?.date.toString()).toBe('2024-06-15');
  });

  test('should return the correct day names based on the locale', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    );

    const { getDaysNames } = result.current;
    const daysNames = getDaysNames();
    expect(daysNames).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    const { result: resultPl } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'pl' })
    );

    const { getDaysNames: getDaysNamesPl } = resultPl.current;
    const daysNamesPl = getDaysNamesPl();
    expect(daysNamesPl).toEqual(['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.']);
  });

  test('should correctly mark days as in current period', () => {
    const { result } = renderHook(() =>
      useCalendar({ events, viewMode: { value: 1, unit: 'month' }, locale: 'en-US' })
    );

    const { days } = result.current;
    const weeks = result.current.groupDaysBy({ days, unit: 'week' });
    const daysInCurrentPeriod = weeks.flat().map(day => day?.isInCurrentPeriod);
    expect(daysInCurrentPeriod).toEqual([
      false, false, false, false, false, false, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, true, true, true, true, true, true,
      true, false, false, false, false, false, false
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
    expect(weeks).toHaveLength(6);
    expect(weeks[0]?.[0]?.date.toString()).toBe('2024-05-26');
    expect(weeks[4]?.[6]?.date.toString()).toBe('2024-06-29');
  });
});
