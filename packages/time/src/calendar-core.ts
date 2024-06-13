import { Store } from '@tanstack/store';
import { Temporal } from '@js-temporal/polyfill';
import { getFirstDayOfMonth, getFirstDayOfWeek } from './utils';
import { generateDateRange } from './calendar/generateDateRange';
import { splitMultiDayEvents } from './calendar/splitMultiDayEvents';
import { getEventProps } from './calendar/getEventProps';
import { groupDaysBy } from './calendar/groupDaysBy';
import type { GroupDaysByProps} from './calendar/groupDaysBy';

export interface Event {
  id: string
  startDate: Temporal.PlainDateTime
  endDate: Temporal.PlainDateTime
  title: string
}

export interface CalendarState {
  currentPeriod: Temporal.PlainDate
  viewMode: {
    value: number
    unit: 'month' | 'week' | 'day'
  }
  currentTime: Temporal.PlainDateTime
}

export type Day<TEvent extends Event = Event> = {
  date: Temporal.PlainDate
  events: TEvent[]
  isToday: boolean
  isInCurrentPeriod: boolean
}

export interface CalendarCoreOptions<TEvent extends Event> {
  weekStartsOn: number;
  events?: TEvent[];
  viewMode: CalendarState['viewMode'];
  locale?: Parameters<Temporal.PlainDate['toLocaleString']>['0'];
}

export class CalendarCore<TEvent extends Event> {
  store: Store<CalendarState>;
  options: CalendarCoreOptions<TEvent>;

  constructor(options: CalendarCoreOptions<TEvent>) {
    this.options = options;
    this.store = new Store<CalendarState>({
      currentPeriod: Temporal.Now.plainDateISO(),
      viewMode: options.viewMode,
      currentTime: Temporal.Now.plainDateTimeISO(),
    });
  }

  private getFirstDayOfMonth() {
    return getFirstDayOfMonth(
      this.store.state.currentPeriod.toString({ calendarName: 'auto' }).substring(0, 7),
    );
  }

  private getFirstDayOfWeek() {
    return getFirstDayOfWeek(this.store.state.currentPeriod.toString(), this.options.weekStartsOn || 1);
  }

  private getCalendarDays() {
    const start =
      this.store.state.viewMode.unit === 'month'
        ? this.getFirstDayOfMonth().subtract({
            days: (this.getFirstDayOfMonth().dayOfWeek - (this.options.weekStartsOn || 1) + 7) % 7,
          })
        : this.store.state.currentPeriod;

    let end;
    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const lastDayOfMonth = this.getFirstDayOfMonth()
          .add({ months: this.store.state.viewMode.value })
          .subtract({ days: 1 });
        const lastDayOfMonthWeekDay =
          (lastDayOfMonth.dayOfWeek - (this.options.weekStartsOn || 1) + 7) % 7;
        end = lastDayOfMonth.add({ days: 6 - lastDayOfMonthWeekDay });
        break;
      }
      case 'week': {
        end = this.getFirstDayOfWeek().add({ days: 7 * this.store.state.viewMode.value - 1 });
        break;
      }
      case 'day': {
        end = this.store.state.currentPeriod.add({ days: this.store.state.viewMode.value - 1 });
        break;
      }
    }

    const allDays = generateDateRange(start, end);
    const startMonth = this.store.state.currentPeriod.month;
    const endMonth = this.store.state.currentPeriod.add({
      months: this.store.state.viewMode.value - 1,
    }).month;

    return allDays.filter(
      (day) => day.month >= startMonth && day.month <= endMonth,
    );
  }

  private getEventMap() {
    const map = new Map<string, TEvent[]>();
    this.options.events?.forEach((event) => {
      const eventStartDate = Temporal.PlainDateTime.from(event.startDate);
      const eventEndDate = Temporal.PlainDateTime.from(event.endDate);
      if (
        Temporal.PlainDate.compare(
          eventStartDate.toPlainDate(),
          eventEndDate.toPlainDate(),
        ) !== 0
      ) {
        const splitEvents = splitMultiDayEvents<TEvent>(event);
        splitEvents.forEach((splitEvent) => {
          const splitKey = splitEvent.startDate.toString().split('T')[0];
          if (splitKey) {
            if (!map.has(splitKey)) map.set(splitKey, []);
            map.get(splitKey)?.push(splitEvent);
          }
        });
      } else {
        const eventKey = event.startDate.toString().split('T')[0];
        if (eventKey) {
          if (!map.has(eventKey)) map.set(eventKey, []);
          map.get(eventKey)?.push(event);
        }
      }
    });
    return map;
  }

  getDaysWithEvents() {
    const calendarDays = this.getCalendarDays();
    const eventMap = this.getEventMap();
    return calendarDays.map((day) => {
      const dayKey = day.toString();
      const dailyEvents = eventMap.get(dayKey) ?? [];
      const currentMonthRange = Array.from(
        { length: this.store.state.viewMode.value },
        (_, i) => this.store.state.currentPeriod.add({ months: i }).month,
      );
      const isInCurrentPeriod = currentMonthRange.includes(day.month);
      return {
        date: day,
        events: dailyEvents,
        isToday:
          Temporal.PlainDate.compare(day, Temporal.Now.plainDateISO()) === 0,
        isInCurrentPeriod,
      };
    });
  }

  getDaysNames() {
    const baseDate = Temporal.PlainDate.from('2024-01-01');
    return Array.from({ length: 7 }).map((_, i) =>
      baseDate
        .add({ days: (i + (this.options.weekStartsOn || 1) - 1) % 7 })
        .toLocaleString(this.options.locale, { weekday: 'short' }),
    );
  }

  changeViewMode(newViewMode: CalendarState['viewMode']) {
    this.store.setState((prev) => ({
      ...prev,
      viewMode: newViewMode,
    }));
  }

  goToPreviousPeriod() {
    const firstDayOfMonth = this.getFirstDayOfMonth();
    const firstDayOfWeek = this.getFirstDayOfWeek();

    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const firstDayOfPrevMonth = firstDayOfMonth.subtract({ months: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfPrevMonth,
        }));
        break;
      }

      case 'week': {
        const firstDayOfPrevWeek = firstDayOfWeek.subtract({ weeks: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfPrevWeek,
        }));
        break;
      }

      case 'day': {
        const prevCustomStart = this.store.state.currentPeriod.subtract({ days: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: prevCustomStart,
        }));
        break;
      }
    }
  }

  goToNextPeriod() {
    const firstDayOfMonth = this.getFirstDayOfMonth();
    const firstDayOfWeek = this.getFirstDayOfWeek();

    switch (this.store.state.viewMode.unit) {
      case 'month': {
        const firstDayOfNextMonth = firstDayOfMonth.add({ months: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfNextMonth,
        }));
        break;
      }

      case 'week': {
        const firstDayOfNextWeek = firstDayOfWeek.add({ weeks: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: firstDayOfNextWeek,
        }));
        break;
      }

      case 'day': {
        const nextCustomStart = this.store.state.currentPeriod.add({ days: this.store.state.viewMode.value });
        this.store.setState((prev) => ({
          ...prev,
          currentPeriod: nextCustomStart,
        }));
        break;
      }
    }
  }

  goToCurrentPeriod() {
    this.store.setState((prev) => ({
      ...prev,
      currentPeriod: Temporal.Now.plainDateISO(),
    }));
  }

  goToSpecificPeriod(date: Temporal.PlainDate) {
    this.store.setState((prev) => ({
      ...prev,
      currentPeriod: date,
    }));
  }

  updateCurrentTime() {
    this.store.setState((prev) => ({
      ...prev,
      currentTime: Temporal.Now.plainDateTimeISO(),
    }));
  }

  getEventProps(id: Event['id']) {
    return getEventProps(this.getEventMap(), id, this.store.state);
  }

  getCurrentTimeMarkerProps() {
    const { hour, minute } = this.store.state.currentTime;
    const currentTimeInMinutes = hour * 60 + minute;
    const percentageOfDay = (currentTimeInMinutes / (24 * 60)) * 100;

    return {
      style: {
        position: 'absolute',
        top: `${percentageOfDay}%`,
        left: 0,
      },
      currentTime: this.store.state.currentTime.toString().split('T')[1]?.substring(0, 5),
    };
  }

  groupDaysBy({ days, unit, fillMissingDays = true }: Omit<GroupDaysByProps<TEvent>, 'weekStartsOn'>) {
    return groupDaysBy({ days, unit, fillMissingDays, weekStartsOn: this.options.weekStartsOn } as GroupDaysByProps<TEvent>);
  }
}
