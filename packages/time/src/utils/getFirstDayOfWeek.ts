import { Temporal } from '@js-temporal/polyfill'

export const getFirstDayOfWeek = (currWeek: string, locale: string = 'en-US') => {
  const date = Temporal.PlainDate.from(currWeek);
  const loc = new Intl.Locale(locale);
  const { firstDay } = loc.weekInfo || loc.getWeekInfo();
  return date.subtract({ days: (date.dayOfWeek - firstDay + 7) % 7 });
}
