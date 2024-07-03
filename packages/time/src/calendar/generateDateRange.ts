import { Temporal } from '@js-temporal/polyfill'
import { validateDate } from '../utils/validateDate'

export const generateDateRange = (
  start: string,
  end: string,
): Temporal.PlainDate[] => {
  validateDate({ date: start })
  validateDate({ date: end })

  const startDate = Temporal.PlainDate.from(start)
  const endDate = Temporal.PlainDate.from(end)
  const dates: Temporal.PlainDate[] = []
  let current = startDate
  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    dates.push(current)
    current = current.add({ days: 1 })
  }
  return dates
}
