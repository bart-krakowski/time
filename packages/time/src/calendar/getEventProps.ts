import { Temporal } from "@js-temporal/polyfill";
import type { CalendarStore, Event } from "./types";

export const getEventProps = (
  eventMap: Map<string, Event[]>,
  id: Event['id'],
  state: CalendarStore,
) => {
  const event = [...eventMap.values()].flat().find((currEvent) => currEvent.id === id);
  if (!event) return null;

  const eventStartDate = Temporal.ZonedDateTime.from(event.start);
  const eventEndDate = Temporal.ZonedDateTime.from(event.end);
  const isSplitEvent = Temporal.PlainDate.compare(eventStartDate.toPlainDate(), eventEndDate.toPlainDate()) !== 0;

  let eventHeightInMinutes;

  if (isSplitEvent) {
    const isStartPart = eventStartDate.hour !== 0 || eventStartDate.minute !== 0;
    if (isStartPart) {
      const eventTimeInMinutes = eventStartDate.hour * 60 + eventStartDate.minute;
      eventHeightInMinutes = 24 * 60 - eventTimeInMinutes;
    } else {
      eventHeightInMinutes = eventEndDate.hour * 60 + eventEndDate.minute;
    }
  } else {
    const eventTimeInMinutes = eventStartDate.hour * 60 + eventStartDate.minute;
    const endTimeInMinutes = eventEndDate.hour * 60 + eventEndDate.minute;
    eventHeightInMinutes = endTimeInMinutes - eventTimeInMinutes;
  }

  const overlappingEvents = [...eventMap.values()].flat().filter((e) => {
    const eStartDate = Temporal.ZonedDateTime.from(e.start);
    const eEndDate = Temporal.ZonedDateTime.from(e.end);
    return (
      (e.id !== id &&
        Temporal.ZonedDateTime.compare(eventStartDate, eStartDate) >= 0 &&
        Temporal.ZonedDateTime.compare(eventStartDate, eEndDate) <= 0) ||
      (Temporal.ZonedDateTime.compare(eventEndDate, eStartDate) >= 0 &&
        Temporal.ZonedDateTime.compare(eventEndDate, eEndDate) <= 0) ||
      (Temporal.ZonedDateTime.compare(eStartDate, eventStartDate) >= 0 &&
        Temporal.ZonedDateTime.compare(eStartDate, eventEndDate) <= 0) ||
      (Temporal.ZonedDateTime.compare(eEndDate, eventStartDate) >= 0 &&
        Temporal.ZonedDateTime.compare(eEndDate, eventEndDate) <= 0)
    );
  });

  if (state.viewMode.unit === 'week' || state.viewMode.unit === 'day') {
    return {
      eventHeightInMinutes,
      isSplitEvent,
      overlappingEvents,
    };
  }

  return null;
};