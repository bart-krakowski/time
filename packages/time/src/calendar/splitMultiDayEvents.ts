import { Temporal } from '@js-temporal/polyfill';
import type { Event } from './types';

export const splitMultiDayEvents = <TEvent extends Event>(event: TEvent, timeZone: Temporal.TimeZoneLike): TEvent[] => {
  const startDate = event.startDate.toZonedDateTime(timeZone);
  const endDate = event.endDate.toZonedDateTime(timeZone);
  const events: TEvent[] = [];

  let currentDay = startDate;
  while (Temporal.ZonedDateTime.compare(currentDay, endDate) < 0) {
    const startOfCurrentDay = currentDay.with({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endOfCurrentDay = currentDay.with({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    const eventStart = Temporal.PlainDateTime.compare(currentDay, startDate) === 0 ? startDate : startOfCurrentDay;
    const eventEnd = Temporal.PlainDateTime.compare(endDate, endOfCurrentDay) <= 0 ? endDate : endOfCurrentDay;

    events.push({ ...event, startDate: eventStart, endDate: eventEnd });

    currentDay = startOfCurrentDay.add({ days: 1 });
  }

  return events;
};
