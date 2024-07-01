import { Temporal } from '@js-temporal/polyfill';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CalendarCore } from '../core/calendar';
import type { CalendarCoreOptions, Event } from '../core/calendar';

describe('CalendarCore', () => {
  let options: CalendarCoreOptions<string, Event<string>>;
  let calendarCore: CalendarCore<string, Event<string>>;
  const mockDate = Temporal.PlainDate.from('2023-06-15');
  const mockDateTime = Temporal.PlainDateTime.from('2023-06-15T10:00');
  const mockTimeZone = 'America/New_York';

  beforeEach(() => {
    options = {
      viewMode: { value: 1, unit: 'month' },
      events: [
        {
          id: '1',
          start: Temporal.PlainDateTime.from('2023-06-10T09:00'),
          end: Temporal.PlainDateTime.from('2023-06-10T10:00'),
          title: 'Event 1',
        },
        {
          id: '2',
          start: Temporal.PlainDateTime.from('2023-06-12T11:00'),
          end: Temporal.PlainDateTime.from('2023-06-12T12:00'),
          title: 'Event 2',
        },
      ],
      timeZone: mockTimeZone,
    };
    calendarCore = new CalendarCore(options);
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(mockDate);
    vi.spyOn(Temporal.Now, 'plainDateTimeISO').mockReturnValue(mockDateTime);
    vi.spyOn(Temporal.Now, 'zonedDateTime').mockReturnValue(Temporal.Now.zonedDateTime('gregory',mockTimeZone));
    vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockReturnValue(Temporal.Now.zonedDateTimeISO());
  });

  test('should initialize with the correct current period', () => {
    const today = Temporal.Now.plainDateISO();
    expect(calendarCore.store.state.currentPeriod).toEqual(today);
  });

  test('should get the correct days with events for the month', () => {
    const daysWithEvents = calendarCore.getDaysWithEvents();
    expect(daysWithEvents.length).toBeGreaterThan(0);
  });

  test('should correctly map events to days', () => {
    const daysWithEvents = calendarCore.getDaysWithEvents();
    const dayWithEvent1 = daysWithEvents.find((day) => day.date.equals(Temporal.PlainDate.from('2023-06-10')));
    const dayWithEvent2 = daysWithEvents.find((day) => day.date.equals(Temporal.PlainDate.from('2023-06-12')));
    expect(dayWithEvent1?.events).toHaveLength(1);
    expect(dayWithEvent1?.events[0]?.id).toBe('1');
    expect(dayWithEvent2?.events).toHaveLength(1);
    expect(dayWithEvent2?.events[0]?.id).toBe('2');
  });

  test('should change view mode correctly', () => {
    calendarCore.changeViewMode({ value: 2, unit: 'week' });
    expect(calendarCore.store.state.viewMode.value).toBe(2);
    expect(calendarCore.store.state.viewMode.unit).toBe('week');
  });

  test('should go to previous period correctly', () => {
    const initialPeriod = calendarCore.store.state.currentPeriod;
    calendarCore.goToPreviousPeriod();
    const expectedPreviousMonth = initialPeriod.subtract({ months: 1 });
    expect(calendarCore.store.state.currentPeriod).toEqual(expectedPreviousMonth);
  });

  test('should go to next period correctly', () => {
    const initialPeriod = calendarCore.store.state.currentPeriod;
    calendarCore.goToNextPeriod();
    const expectedNextMonth = initialPeriod.add({ months: 1 });
    expect(calendarCore.store.state.currentPeriod).toEqual(expectedNextMonth);
  });

  test('should go to current period correctly', () => {
    calendarCore.goToNextPeriod();
    calendarCore.goToCurrentPeriod();
    const today = Temporal.Now.plainDateISO();
    expect(calendarCore.store.state.currentPeriod).toEqual(today);
  });

  test('should go to specific period correctly', () => {
    const specificDate = Temporal.PlainDate.from('2023-07-01');
    calendarCore.goToSpecificPeriod(specificDate);
    expect(calendarCore.store.state.currentPeriod).toEqual(specificDate);
  });

  test('should group days correctly', () => {
    const daysWithEvents = calendarCore.getDaysWithEvents();
    const groupedDays = calendarCore.groupDaysBy({ days: daysWithEvents, unit: 'month' });
    expect(groupedDays.length).toBeGreaterThan(0);
  });

  test('should initialize with the correct time zone', () => {
    expect(calendarCore.options.timeZone).toBe(mockTimeZone);
  });

  test('should respect custom calendar', () => {
    const customCalendar = 'islamic-civil';
    options.calendar = customCalendar;
    calendarCore = new CalendarCore(options);

    const today = Temporal.Now.plainDateISO(customCalendar);
    expect(calendarCore.store.state.currentPeriod.calendarId).toBe(customCalendar);
    expect(calendarCore.store.state.currentPeriod).toEqual(today);
  });
});
