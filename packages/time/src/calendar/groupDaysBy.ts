import { Temporal } from "@js-temporal/polyfill";
import type { Day, Event } from "./types";

interface GroupDaysByBaseProps<TEvent extends Event = Event> {
  days: (Day<TEvent> | null)[];
  weekStartsOn: number;
}

type GroupDaysByMonthProps<TEvent extends Event = Event> = GroupDaysByBaseProps<TEvent> & {
  unit: 'month';
  fillMissingDays?: never;
};

type GroupDaysByWeekProps<TEvent extends Event = Event> = GroupDaysByBaseProps<TEvent> & {
  unit: 'week';
  fillMissingDays?: boolean;
};

export type GroupDaysByProps<TEvent extends Event = Event> = GroupDaysByMonthProps<TEvent> | GroupDaysByWeekProps<TEvent>;

export const groupDaysBy = <TEvent extends Event>({
  days,
  unit,
  fillMissingDays = true,
  weekStartsOn,
}: GroupDaysByProps<TEvent>): (Day<TEvent> | null)[][] => {
  const groups: (Day<TEvent> | null)[][] = [];

  switch (unit) {
    case 'month': {
      let currentMonth: (Day<TEvent> | null)[] = [];
      days.forEach((day) => {
        if (currentMonth.length > 0 && day?.date.month !== currentMonth[0]?.date.month) {
          groups.push(currentMonth);
          currentMonth = [];
        }
        currentMonth.push(day);
      });
      if (currentMonth.length > 0) {
        groups.push(currentMonth);
      }
      break;
    }

    case 'week': {
      const weeks: (Day<TEvent> | null)[][] = [];
      let currentWeek: (Day<TEvent> | null)[] = [];

      days.forEach((day) => {
        if (currentWeek.length === 0 && day?.date.dayOfWeek !== weekStartsOn) {
          if (day) {
            const dayOfWeek = (day.date.dayOfWeek - weekStartsOn + 7) % 7;
            for (let i = 0; i < dayOfWeek; i++) {
              currentWeek.push(
                fillMissingDays
                  ? {
                      date: day.date.subtract({ days: dayOfWeek - i }),
                      events: [],
                      isToday: false,
                      isInCurrentPeriod: false,
                    }
                  : null
              );
            }
          }
        }
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          const lastDate = currentWeek[currentWeek.length - 1]?.date ?? Temporal.PlainDate.from('2024-01-01');
          currentWeek.push(
            fillMissingDays
              ? {
                  date: lastDate.add({ days: 1 }),
                  events: [],
                  isToday: false,
                  isInCurrentPeriod: false,
                }
              : null
          );
        }
        weeks.push(currentWeek);
      }

      return weeks;
    }
    default:
      break;
  }
  return groups;
};
