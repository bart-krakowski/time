import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, test } from 'vitest'
import { endOf } from '../utils'

describe('endOf', () => {
  test('should get the end of the given day', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'day')
    const expected = Temporal.ZonedDateTime.from('2023-07-16T23:59:59.999+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the end of the given week', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-13T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'week')
    const expected = Temporal.ZonedDateTime.from('2023-07-16T23:59:59.999+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the end of the given month', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'month')
    const expected = Temporal.ZonedDateTime.from('2023-07-31T23:59:59.999+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the end of the given year', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'year')
    const expected = Temporal.ZonedDateTime.from('2023-12-31T23:59:59.999+00:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the end of the given work week', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-10T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'workWeek')
    const expected = Temporal.ZonedDateTime.from('2023-07-14T23:59:59.999+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the end of the given decade', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = endOf(date, 'decade')
    const expected = Temporal.ZonedDateTime.from('2029-12-31T23:59:59.999+00:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })
})
