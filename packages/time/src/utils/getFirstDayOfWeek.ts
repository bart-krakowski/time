import { Temporal } from '@js-temporal/polyfill'

export const getFirstDayOfWeek = (currWeek: string, weekStartsOn: number) => {
  const date = Temporal.PlainDate.from(currWeek)
  return date.subtract({ days: (date.dayOfWeek - weekStartsOn + 7) % 7 })
}
