import { Temporal } from "@js-temporal/polyfill";
import type { Properties as CSSProperties } from "csstype";
import type { CalendarState, Event } from "./types";

export const getEventProps = (
  eventMap: Map<string, Event[]>,
  id: Event['id'],
  state: CalendarState
): { style: CSSProperties } | null => {
  const event = [...eventMap.values()].flat().find((currEvent) => currEvent.id === id);
  if (!event) return null;

  const eventStartDate = Temporal.PlainDateTime.from(event.startDate);
  const eventEndDate = Temporal.PlainDateTime.from(event.endDate);
  const isSplitEvent = Temporal.PlainDate.compare(eventStartDate.toPlainDate(), eventEndDate.toPlainDate()) !== 0;

  let percentageOfDay;
  let eventHeightInMinutes;

  if (isSplitEvent) {
    const isStartPart = eventStartDate.hour !== 0 || eventStartDate.minute !== 0;
    if (isStartPart) {
      const eventTimeInMinutes = eventStartDate.hour * 60 + eventStartDate.minute;
      percentageOfDay = (eventTimeInMinutes / (24 * 60)) * 100;
      eventHeightInMinutes = 24 * 60 - eventTimeInMinutes;
    } else {
      percentageOfDay = 0;
      eventHeightInMinutes = eventEndDate.hour * 60 + eventEndDate.minute;
    }
  } else {
    const eventTimeInMinutes = eventStartDate.hour * 60 + eventStartDate.minute;
    percentageOfDay = (eventTimeInMinutes / (24 * 60)) * 100;
    const endTimeInMinutes = eventEndDate.hour * 60 + eventEndDate.minute;
    eventHeightInMinutes = endTimeInMinutes - eventTimeInMinutes;
  }

  const eventHeight = Math.min((eventHeightInMinutes / (24 * 60)) * 100, 20);

  const overlappingEvents = [...eventMap.values()].flat().filter((e) => {
    const eStartDate = Temporal.PlainDateTime.from(e.startDate);
    const eEndDate = Temporal.PlainDateTime.from(e.endDate);
    return (
      (e.id !== id &&
        Temporal.PlainDateTime.compare(eventStartDate, eStartDate) >= 0 &&
        Temporal.PlainDateTime.compare(eventStartDate, eEndDate) <= 0) ||
      (Temporal.PlainDateTime.compare(eventEndDate, eStartDate) >= 0 &&
        Temporal.PlainDateTime.compare(eventEndDate, eEndDate) <= 0) ||
      (Temporal.PlainDateTime.compare(eStartDate, eventStartDate) >= 0 &&
        Temporal.PlainDateTime.compare(eStartDate, eventEndDate) <= 0) ||
      (Temporal.PlainDateTime.compare(eEndDate, eventStartDate) >= 0 &&
        Temporal.PlainDateTime.compare(eEndDate, eventEndDate) <= 0)
    );
  });

  const eventIndex = overlappingEvents.findIndex((e) => e.id === id);
  const totalOverlaps = overlappingEvents.length;
  const sidePadding = 2;
  const innerPadding = 2;
  const totalInnerPadding = (totalOverlaps - 1) * innerPadding;
  const availableWidth = 100 - totalInnerPadding - 2 * sidePadding;
  const eventWidth = totalOverlaps > 0 ? availableWidth / totalOverlaps : 100 - 2 * sidePadding;
  const eventLeft = sidePadding + eventIndex * (eventWidth + innerPadding);

  if (state.viewMode.unit === 'week' || state.viewMode.unit === 'day') {
    return {
      style: {
        position: 'absolute',
        top: `min(${percentageOfDay}%, calc(100% - 55px))`,
        left: `${eventLeft}%`,
        width: `${eventWidth}%`,
        margin: 0,
        height: `${eventHeight}%`,
      },
    };
  }

  return null;
};