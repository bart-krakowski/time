import { Temporal } from '@js-temporal/polyfill'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CalendarCore } from '../core/calendar'
import type { CalendarCoreOptions, Event } from '../core/calendar'

describe('CalendarCore', () => {
  let options: CalendarCoreOptions<string, Event<string>>
  let calendarCore: CalendarCore<string, Event<string>>
  const mockDate = Temporal.PlainDate.from('2024-06-15')
  const mockDateTime = Temporal.PlainDateTime.from('2024-06-15T10:00')
  const mockTimeZone = 'America/New_York'

  beforeEach(() => {
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(mockDate)
    vi.spyOn(Temporal.Now, 'plainDateTimeISO').mockReturnValue(mockDateTime)
    vi.spyOn(Temporal.Now, 'zonedDateTime').mockReturnValue(
      Temporal.ZonedDateTime.from({
        timeZone: mockTimeZone,
        year: 2024,
        month: 6,
        day: 15,
        hour: 10,
        minute: 0,
        second: 0,
      }),
    )
    vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(
      Temporal.ZonedDateTime.from({
        timeZone: mockTimeZone,
        year: 2024,
        month: 6,
        day: 15,
        hour: 10,
        minute: 0,
        second: 0,
      }),
    )

    options = {
      viewMode: { value: 1, unit: 'month' },
      events: [
        {
          id: '1',
          start: Temporal.PlainDateTime.from('2024-06-10T09:00'),
          end: Temporal.PlainDateTime.from('2024-06-10T10:00'),
          title: 'Event 1',
        },
        {
          id: '2',
          start: Temporal.PlainDateTime.from('2024-06-12T11:00'),
          end: Temporal.PlainDateTime.from('2024-06-12T12:00'),
          title: 'Event 2',
        },
        {
          id: '3',
          start: Temporal.PlainDateTime.from('2024-06-12T11:00'),
          end: Temporal.PlainDateTime.from('2024-06-12T13:00'),
          title: 'Event 3',
        },
      ],
      timeZone: mockTimeZone,
    }
    calendarCore = new CalendarCore(options)
  })

  describe('Initialization', () => {
    test('should initialize with the correct current period', () => {
      const today = Temporal.Now.plainDateISO()
      expect(calendarCore.store.state.currentPeriod).toEqual(today)
      expect(calendarCore.store.state.activeDate).toEqual(today)
    })

    test('should initialize with the correct time zone', () => {
      expect(calendarCore.options.timeZone).toBe(mockTimeZone)
    })

    test('should respect custom calendar', () => {
      const customCalendar = 'islamic-civil'
      options.calendar = customCalendar
      calendarCore = new CalendarCore(options)

      const today = Temporal.Now.plainDateISO(customCalendar)
      expect(calendarCore.store.state.currentPeriod.calendarId).toBe(
        customCalendar,
      )
      expect(calendarCore.store.state.currentPeriod).toEqual(today)
      expect(calendarCore.store.state.activeDate).toEqual(today)
    })
  })

  describe('Event mapping', () => {
    test('should get the correct days with events for the month', () => {
      const daysWithEvents = calendarCore.getDaysWithEvents()
      expect(daysWithEvents.length).toBeGreaterThan(0)
    })

    test('should correctly map events to days', () => {
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const dayWithEvent1 = daysWithEvents.find((day) =>
        day.date.equals(Temporal.PlainDate.from('2024-06-10')),
      )
      const dayWithEvent2 = daysWithEvents.find((day) =>
        day.date.equals(Temporal.PlainDate.from('2024-06-12')),
      )
      expect(dayWithEvent1?.events).toHaveLength(1)
      expect(dayWithEvent1?.events[0]?.id).toBe('1')
      expect(dayWithEvent2?.events).toHaveLength(2)
      expect(dayWithEvent2?.events[0]?.id).toBe('2')
      expect(dayWithEvent2?.events[1]?.id).toBe('3')
    })

    test('should return the correct props for an event', () => {
      const eventProps = calendarCore.getEventProps('1')
      expect(eventProps).toEqual({
        eventHeightInMinutes: 60,
        isSplitEvent: false,
        overlappingEvents: [],
      })
    })

    test('should return the correct props for overlapping events', () => {
      const event1Props = calendarCore.getEventProps('2')
      const event2Props = calendarCore.getEventProps('3')

      expect(event1Props).toEqual({
        eventHeightInMinutes: 60,
        isSplitEvent: false,
        overlappingEvents: [options.events![2]],
      })

      expect(event2Props).toEqual({
        eventHeightInMinutes: 120,
        isSplitEvent: false,
        overlappingEvents: [options.events![1]],
      })
    })
  })

  describe('View mode', () => {
    test('should change view mode correctly', () => {
      calendarCore.changeViewMode({ value: 2, unit: 'week' })
      expect(calendarCore.store.state.viewMode.value).toBe(2)
      expect(calendarCore.store.state.viewMode.unit).toBe('week')
    })

    test('should change view mode to workWeek correctly', () => {
      calendarCore.changeViewMode({ value: 1, unit: 'workWeek' })
      expect(calendarCore.store.state.viewMode.value).toBe(1)
      expect(calendarCore.store.state.viewMode.unit).toBe('workWeek')
    })
  })

  describe('Navigation', () => {
    test('should go to previous period correctly', () => {
      const initialPeriod = calendarCore.store.state.currentPeriod
      calendarCore.goToPreviousPeriod()
      const expectedPreviousMonth = initialPeriod.subtract({ months: 1 })
      expect(calendarCore.store.state.currentPeriod).toEqual(
        expectedPreviousMonth,
      )
      expect(calendarCore.store.state.activeDate).toEqual(expectedPreviousMonth)
    })

    test('should go to next period correctly', () => {
      const initialPeriod = calendarCore.store.state.currentPeriod
      calendarCore.goToNextPeriod()
      const expectedNextMonth = initialPeriod.add({ months: 1 })
      expect(calendarCore.store.state.currentPeriod).toEqual(expectedNextMonth)
      expect(calendarCore.store.state.activeDate).toEqual(expectedNextMonth)
    })

    test('should go to current period correctly', () => {
      calendarCore.goToNextPeriod()
      calendarCore.goToCurrentPeriod()
      const today = Temporal.Now.plainDateISO()
      expect(calendarCore.store.state.currentPeriod).toEqual(today)
      expect(calendarCore.store.state.activeDate).toEqual(today)
    })

    test('should go to specific period correctly', () => {
      const specificDate = Temporal.PlainDate.from('2024-07-01')
      calendarCore.goToSpecificPeriod(specificDate)
      expect(calendarCore.store.state.currentPeriod).toEqual(specificDate)
      expect(calendarCore.store.state.activeDate).toEqual(specificDate)
    })

    test('should go to previous workWeek correctly', () => {
      calendarCore.changeViewMode({ value: 1, unit: 'workWeek' })
      const initialPeriod = calendarCore.store.state.currentPeriod
      calendarCore.goToPreviousPeriod()
      const expectedPreviousWorkWeek = initialPeriod.subtract({ days: 7 })
      expect(calendarCore.store.state.currentPeriod).toEqual(
        expectedPreviousWorkWeek,
      )
      expect(calendarCore.store.state.activeDate).toEqual(
        expectedPreviousWorkWeek,
      )
    })

    test('should go to next workWeek correctly', () => {
      calendarCore.changeViewMode({ value: 1, unit: 'workWeek' })
      const initialPeriod = calendarCore.store.state.currentPeriod
      calendarCore.goToNextPeriod()
      const expectedNextWorkWeek = initialPeriod.add({ days: 7 })
      expect(calendarCore.store.state.currentPeriod).toEqual(
        expectedNextWorkWeek,
      )
      expect(calendarCore.store.state.activeDate).toEqual(expectedNextWorkWeek)
    })
  })

  describe('Days grouping', () => {
    test('should group days correctly', () => {
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const groupedDays = calendarCore.groupDaysBy({
        days: daysWithEvents,
        unit: 'month',
      })
      expect(groupedDays.length).toBeGreaterThan(0)
    })

    test('should group days by weeks correctly', () => {
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const weeks = calendarCore.groupDaysBy({
        days: daysWithEvents,
        unit: 'week',
      })

      expect(weeks).toHaveLength(6)
      expect(weeks[0]?.[0]?.date.toString()).toBe('2024-05-26')
      expect(weeks[5]?.[6]?.date.toString()).toBe('2024-07-06')
    })

    test('should group days by months correctly', () => {
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const months = calendarCore.groupDaysBy({
        days: daysWithEvents,
        unit: 'month',
      })
      expect(months).toHaveLength(1)
      expect(months[0]?.[0]?.date.toString()).toBe('2024-06-01')
    })

    test('should group days by workWeek correctly', () => {
      calendarCore.changeViewMode({ value: 1, unit: 'workWeek' })
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const workWeeks = calendarCore.groupDaysBy({
        days: daysWithEvents,
        unit: 'workWeek',
      })

      expect(workWeeks.length).toBeGreaterThan(0)
      expect(workWeeks[0]?.length).toBe(5)
      expect(workWeeks[0]?.[0]?.date.toString()).toBe(
        '2024-06-10[u-ca=gregory]',
      )
      expect(workWeeks[0]?.[4]?.date.toString()).toBe(
        '2024-06-14[u-ca=gregory]',
      )
    })

    test('should group days by workWeek correctly with custom locale', () => {
      const customLocale = 'pl'
      calendarCore = new CalendarCore({ ...options, locale: customLocale })
      const daysWithEvents = calendarCore.getDaysWithEvents()
      const workWeeks = calendarCore.groupDaysBy({
        days: daysWithEvents,
        unit: 'workWeek',
      })

      expect(workWeeks.length).toBeGreaterThan(0)
      expect(workWeeks[0]?.length).toBe(5)
      expect(workWeeks[0]?.[0]?.date.toString()).toBe('2024-05-27')
      expect(workWeeks[0]?.[4]?.date.toString()).toBe('2024-05-31')
    })
  })

  describe('Locale and timezone', () => {
    test('should return the correct day names based on default locale', () => {
      const daysNames = calendarCore.getDaysNames('short')
      expect(daysNames).toEqual([
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ])
    })

    test('should return the correct day names based on custom locale', () => {
      const customLocale = 'pl'
      calendarCore = new CalendarCore({ ...options, locale: customLocale })
      const customDaysNames = calendarCore.getDaysNames('short')
      expect(customDaysNames).toEqual([
        'pon.',
        'wt.',
        'śr.',
        'czw.',
        'pt.',
        'sob.',
        'niedz.',
      ])
    })
  })
})
