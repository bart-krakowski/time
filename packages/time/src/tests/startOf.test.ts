
import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, test } from 'vitest'
import { startOf } from '../utils'

describe('startOf', () => {
  test('should get the start of the given day', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'day')
    const expected = Temporal.ZonedDateTime.from('2023-07-16T00:00:00.000+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the start of the given week', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'week')
    const expected = Temporal.ZonedDateTime.from('2023-07-10T00:00:00.000+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the start of the given month', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'month')
    const expected = Temporal.ZonedDateTime.from('2023-07-01T00:00:00.000+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the start of the given year', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'year')
    console.log('result', result.toString())
    const expected = Temporal.ZonedDateTime.from('2023-01-01T00:00:00.000+00:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the start of the given work week', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'workWeek')
    const expected = Temporal.ZonedDateTime.from('2023-07-10T00:00:00.000+01:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })

  test('should get the start of the given decade', () => {
    const date = Temporal.ZonedDateTime.from('2023-07-16T12:34:56.789+01:00[Europe/London]')
    const result = startOf(date, 'decade')
    const expected = Temporal.ZonedDateTime.from('2020-01-01T00:00:00.000+00:00[Europe/London]')
    expect(result.equals(expected)).toBe(true)
  })
})
