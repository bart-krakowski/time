/**
 * Core date utility functions
 */

export class DateUtils {
  static startOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }

  static endOfDay(date: Date): Date {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }

  static startOfWeek(date: Date, weekStartsOn: number = 0): Date {
    const result = new Date(date)
    const day = result.getDay()
    const diff = (day - weekStartsOn + 7) % 7
    result.setDate(result.getDate() - diff)
    return this.startOfDay(result)
  }

  static endOfWeek(date: Date, weekStartsOn: number = 0): Date {
    const start = this.startOfWeek(date, weekStartsOn)
    const result = new Date(start)
    result.setDate(result.getDate() + 6)
    return this.endOfDay(result)
  }

  static startOfMonth(date: Date): Date {
    const result = new Date(date.getFullYear(), date.getMonth(), 1)
    return this.startOfDay(result)
  }

  static endOfMonth(date: Date): Date {
    const result = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return this.endOfDay(result)
  }

  static startOfYear(date: Date): Date {
    const result = new Date(date.getFullYear(), 0, 1)
    return this.startOfDay(result)
  }

  static endOfYear(date: Date): Date {
    const result = new Date(date.getFullYear(), 11, 31)
    return this.endOfDay(result)
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  static addWeeks(date: Date, weeks: number): Date {
    return this.addDays(date, weeks * 7)
  }

  static addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  static addYears(date: Date, years: number): Date {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  static isSameWeek(date1: Date, date2: Date, weekStartsOn: number = 0): boolean {
    const week1Start = this.startOfWeek(date1, weekStartsOn)
    const week2Start = this.startOfWeek(date2, weekStartsOn)
    return week1Start.getTime() === week2Start.getTime()
  }

  static isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
  }

  static isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
  }

  static isBefore(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime()
  }

  static isAfter(date1: Date, date2: Date): boolean {
    return date1.getTime() > date2.getTime()
  }

  static isBetween(date: Date, start: Date, end: Date): boolean {
    const time = date.getTime()
    return time >= start.getTime() && time <= end.getTime()
  }

  static differenceInDays(date1: Date, date2: Date): number {
    const diff = date1.getTime() - date2.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  static differenceInWeeks(date1: Date, date2: Date): number {
    return Math.floor(this.differenceInDays(date1, date2) / 7)
  }

  static differenceInMonths(date1: Date, date2: Date): number {
    const years = date1.getFullYear() - date2.getFullYear()
    const months = date1.getMonth() - date2.getMonth()
    return years * 12 + months
  }

  static differenceInYears(date1: Date, date2: Date): number {
    return date1.getFullYear() - date2.getFullYear()
  }

  static format(date: Date, format: string, locale?: string): string {
    // Simple format implementation - can be enhanced with a proper formatter
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }

  static parse(dateString: string, format: string, locale?: string): Date {
    // Simple parse implementation - should be enhanced with proper parsing
    // This is a basic example
    const parts = dateString.split(/[-\s:]/)
    const formatParts = format.split(/[-\s:]/)

    let year = 0
    let month = 0
    let day = 0
    let hours = 0
    let minutes = 0
    let seconds = 0

    formatParts.forEach((part, index) => {
      const value = parseInt(parts[index] || '0', 10)
      if (part.includes('Y')) year = value
      if (part.includes('M')) month = value - 1
      if (part.includes('D')) day = value
      if (part.includes('H')) hours = value
      if (part.includes('m') && !part.includes('M')) minutes = value
      if (part.includes('s')) seconds = value
    })

    return new Date(year, month, day, hours, minutes, seconds)
  }
}
