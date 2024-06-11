import { Temporal } from '@js-temporal/polyfill';
import type { Event } from './types';

export const splitMultiDayEvents = <TEvent extends Event>(event: TEvent): TEvent[] => {
  const startDate = Temporal.PlainDateTime.from(event.startDate);
  const endDate = Temporal.PlainDateTime.from(event.endDate);
  const events: TEvent[] = [];

  let currentDay = startDate;
  while (Temporal.PlainDate.compare(currentDay.toPlainDate(), endDate.toPlainDate()) < 0) {
    const startOfCurrentDay = currentDay.with({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endOfCurrentDay = currentDay.with({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    const eventStart = Temporal.PlainDateTime.compare(currentDay, startDate) === 0 ? startDate : startOfCurrentDay;
    const eventEnd = Temporal.PlainDateTime.compare(endDate, endOfCurrentDay) <= 0 ? endDate : endOfCurrentDay;

    events.push({ ...event, startDate: eventStart, endDate: eventEnd });

    currentDay = startOfCurrentDay.add({ days: 1 });
  }

  return events;
};
