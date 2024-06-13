import { useEffect, useRef, useState, useTransition } from 'react';
import { Temporal } from '@js-temporal/polyfill';

import { CalendarCore, type CalendarCoreOptions, type Event } from '@tanstack/time';
import type { CalendarState} from '@tanstack/time';

export const useCalendar = <TEvent extends Event>(options: CalendarCoreOptions<TEvent>) => {
  const [calendarCore] = useState(() => new CalendarCore(options));
  const [state, setState] = useState(calendarCore.store.state);

  const [isPending, startTransition] = useTransition();
  const currentTimeInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateCurrentTime = () => {
      calendarCore.updateCurrentTime();
      setState({ ...calendarCore.store.state });
    };

    if (currentTimeInterval.current) clearTimeout(currentTimeInterval.current);

    const now = Temporal.Now.plainDateTimeISO();
    const msToNextMinute = (60 - now.second) * 1000 - now.millisecond;

    currentTimeInterval.current = setTimeout(() => {
      updateCurrentTime();
      currentTimeInterval.current = setInterval(updateCurrentTime, 60000);
    }, msToNextMinute);

    return () => clearTimeout(currentTimeInterval.current);
  }, [calendarCore]);

  const goToPreviousPeriod = () => {
    startTransition(() => {
      calendarCore.goToPreviousPeriod();
      setState({ ...calendarCore.store.state });
    });
  };

  const goToNextPeriod = () => {
    startTransition(() => {
      calendarCore.goToNextPeriod();
      setState({ ...calendarCore.store.state });
    });
  };

  const goToCurrentPeriod = () => {
    startTransition(() => {
      calendarCore.goToCurrentPeriod();
      setState({ ...calendarCore.store.state });
    });
  };

  const goToSpecificPeriod = (date: Temporal.PlainDate) => {
    startTransition(() => {
      calendarCore.goToSpecificPeriod(date);
      setState({ ...calendarCore.store.state });
    });
  };

  const changeViewMode = (newViewMode: CalendarState['viewMode']) => {
    startTransition(() => {
      calendarCore.changeViewMode(newViewMode);
      setState({ ...calendarCore.store.state });
    });
  };

  return {
    ...state,
    goToPreviousPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    goToSpecificPeriod,
    days: calendarCore.getDaysWithEvents(),
    daysNames: calendarCore.getDaysNames(),
    changeViewMode,
    getEventProps: calendarCore.getEventProps.bind(calendarCore),
    getCurrentTimeMarkerProps: calendarCore.getCurrentTimeMarkerProps.bind(calendarCore),
    isPending,
    groupDaysBy: calendarCore.groupDaysBy.bind(calendarCore),
  };
};
