/**
 * Core Calendar class for managing calendar state and navigation
 */

export type CalendarView = 'month' | 'week' | 'day' | 'year'

export interface CalendarDay {
  date: Date
  dayOfMonth: number
  dayOfWeek: number
  weekOfYear: number
  month: number
  year: number
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  isCurrentMonth: boolean
  isCurrentWeek: boolean
  isWeekend: boolean
  isDisabled: boolean
  isSelected: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  ariaLabel: string
}

export interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
  startDate: Date
  endDate: Date
}

export interface CalendarMonth {
  month: number
  year: number
  weeks: CalendarWeek[]
  days: CalendarDay[]
  startDate: Date
  endDate: Date
}

export interface CalendarYear {
  year: number
  months: CalendarMonth[]
  startDate: Date
  endDate: Date
}

export interface CalendarState {
  view: CalendarView
  focusedDate: Date
  visibleRange: { start: Date; end: Date }
  locale: string
  timezone: string
  firstDayOfWeek: number
}

export interface CalendarOptions {
  locale?: string
  timezone?: string
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  initialView?: CalendarView
  initialDate?: Date
  onNavigate?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
}

type CalendarListener = (state: CalendarState) => void

export class Calendar {
  private state: CalendarState
  private listeners: Set<CalendarListener> = new Set()
  private options: Required<Pick<CalendarOptions, 'locale' | 'timezone' | 'firstDayOfWeek'>> &
    Pick<CalendarOptions, 'onNavigate' | 'onViewChange'>

  constructor(options: CalendarOptions = {}) {
    const now = new Date()
    
    this.options = {
      locale: options.locale ?? 'en-US',
      timezone: options.timezone ?? 'UTC',
      firstDayOfWeek: options.firstDayOfWeek ?? 0,
      onNavigate: options.onNavigate,
      onViewChange: options.onViewChange,
    }

    this.state = {
      view: options.initialView ?? 'month',
      focusedDate: options.initialDate ?? now,
      visibleRange: this.calculateVisibleRange(options.initialView ?? 'month', options.initialDate ?? now),
      locale: this.options.locale,
      timezone: this.options.timezone,
      firstDayOfWeek: this.options.firstDayOfWeek,
    }
  }

  // Getters
  get view(): CalendarView {
    return this.state.view
  }

  get focusedDate(): Date {
    return this.state.focusedDate
  }

  get visibleRange(): { start: Date; end: Date } {
    return this.state.visibleRange
  }

  get locale(): string {
    return this.state.locale
  }

  get timezone(): string {
    return this.state.timezone
  }

  get firstDayOfWeek(): number {
    return this.state.firstDayOfWeek
  }

  // Navigation methods
  navigate(direction: 'prev' | 'next' | 'today'): void {
    let newDate: Date

    switch (direction) {
      case 'prev':
        newDate = this.getPreviousDate(this.state.focusedDate)
        break
      case 'next':
        newDate = this.getNextDate(this.state.focusedDate)
        break
      case 'today':
        newDate = new Date()
        break
    }

    this.setFocusedDate(newDate)
    this.options.onNavigate?.(newDate)
  }

  setView(view: CalendarView): void {
    if (this.state.view === view) return

    this.state = {
      ...this.state,
      view,
      visibleRange: this.calculateVisibleRange(view, this.state.focusedDate),
    }

    this.notify()
    this.options.onViewChange?.(view)
  }

  setFocusedDate(date: Date): void {
    if (this.isSameDate(this.state.focusedDate, date)) return

    this.state = {
      ...this.state,
      focusedDate: date,
      visibleRange: this.calculateVisibleRange(this.state.view, date),
    }

    this.notify()
    this.options.onNavigate?.(date)
  }

  goToDate(date: Date): void {
    this.setFocusedDate(date)
  }

  // Computed data methods
  getDays(): CalendarDay[] {
    const { start, end } = this.state.visibleRange
    const days: CalendarDay[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      days.push(this.createCalendarDay(new Date(currentDate)))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  getWeeks(): CalendarWeek[] {
    const days = this.getDays()
    const weeks: CalendarWeek[] = []
    let currentWeek: CalendarDay[] = []

    days.forEach((day, index) => {
      currentWeek.push(day)

      if (day.dayOfWeek === (this.state.firstDayOfWeek + 6) % 7 || index === days.length - 1) {
        weeks.push({
          weekNumber: this.getWeekNumber(day.date),
          days: [...currentWeek],
          startDate: currentWeek[0].date,
          endDate: currentWeek[currentWeek.length - 1].date,
        })
        currentWeek = []
      }
    })

    return weeks
  }

  getMonths(): CalendarMonth[] {
    const months: CalendarMonth[] = []
    const startYear = this.state.focusedDate.getFullYear()
    const startMonth = this.state.focusedDate.getMonth()

    for (let i = -1; i <= 1; i++) {
      const monthDate = new Date(startYear, startMonth + i, 1)
      const month = this.getMonthData(monthDate)
      months.push(month)
    }

    return months
  }

  getYears(): CalendarYear[] {
    const years: CalendarYear[] = []
    const currentYear = this.state.focusedDate.getFullYear()

    for (let i = -5; i <= 5; i++) {
      const year = currentYear + i
      years.push({
        year,
        months: this.getYearMonths(year),
        startDate: new Date(year, 0, 1),
        endDate: new Date(year, 11, 31, 23, 59, 59, 999),
      })
    }

    return years
  }

  // Subscription
  subscribe(listener: CalendarListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Private helpers
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private calculateVisibleRange(view: CalendarView, date: Date): { start: Date; end: Date } {
    switch (view) {
      case 'day':
        return {
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
        }
      case 'week':
        return this.getWeekRange(date)
      case 'month':
        return this.getMonthRange(date)
      case 'year':
        return {
          start: new Date(date.getFullYear(), 0, 1),
          end: new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999),
        }
    }
  }

  private getPreviousDate(date: Date): Date {
    const newDate = new Date(date)
    switch (this.state.view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    return newDate
  }

  private getNextDate(date: Date): Date {
    const newDate = new Date(date)
    switch (this.state.view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    return newDate
  }

  private createCalendarDay(date: Date): CalendarDay {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(date)
    dayDate.setHours(0, 0, 0, 0)

    const isToday = this.isSameDate(dayDate, today)
    const isPast = dayDate < today
    const isFuture = dayDate > today
    const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6

    return {
      date: dayDate,
      dayOfMonth: dayDate.getDate(),
      dayOfWeek: dayDate.getDay(),
      weekOfYear: this.getWeekNumber(dayDate),
      month: dayDate.getMonth(),
      year: dayDate.getFullYear(),
      isToday,
      isPast,
      isFuture,
      isCurrentMonth: dayDate.getMonth() === this.state.focusedDate.getMonth(),
      isCurrentWeek: this.isSameWeek(dayDate, this.state.focusedDate),
      isWeekend,
      isDisabled: false, // Can be set by DatePicker
      isSelected: false, // Can be set by DatePicker
      isInRange: false, // Can be set by DatePicker
      isRangeStart: false, // Can be set by DatePicker
      isRangeEnd: false, // Can be set by DatePicker
      ariaLabel: this.formatAriaLabel(dayDate),
    }
  }

  private getWeekRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date)
    const dayOfWeek = start.getDay()
    const diff = (dayOfWeek - this.state.firstDayOfWeek + 7) % 7
    start.setDate(start.getDate() - diff)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    return { start, end }
  }

  private getMonthRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const firstDayOfWeek = start.getDay()
    const diff = (firstDayOfWeek - this.state.firstDayOfWeek + 7) % 7
    start.setDate(start.getDate() - diff)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const lastDayOfWeek = end.getDay()
    const diffEnd = (this.state.firstDayOfWeek + 6 - lastDayOfWeek) % 7
    end.setDate(end.getDate() + diffEnd)
    end.setHours(23, 59, 59, 999)

    return { start, end }
  }

  private getMonthData(date: Date): CalendarMonth {
    const range = this.getMonthRange(date)
    const days = this.getDaysInRange(range.start, range.end)
    const weeks = this.groupDaysIntoWeeks(days)

    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      weeks,
      days,
      startDate: range.start,
      endDate: range.end,
    }
  }

  private getYearMonths(year: number): CalendarMonth[] {
    const months: CalendarMonth[] = []
    for (let month = 0; month < 12; month++) {
      months.push(this.getMonthData(new Date(year, month, 1)))
    }
    return months
  }

  private getDaysInRange(start: Date, end: Date): CalendarDay[] {
    const days: CalendarDay[] = []
    const current = new Date(start)
    while (current <= end) {
      days.push(this.createCalendarDay(new Date(current)))
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  private groupDaysIntoWeeks(days: CalendarDay[]): CalendarWeek[] {
    const weeks: CalendarWeek[] = []
    let currentWeek: CalendarDay[] = []

    days.forEach((day, index) => {
      currentWeek.push(day)
      if (day.dayOfWeek === (this.state.firstDayOfWeek + 6) % 7 || index === days.length - 1) {
        weeks.push({
          weekNumber: day.weekOfYear,
          days: [...currentWeek],
          startDate: currentWeek[0].date,
          endDate: currentWeek[currentWeek.length - 1].date,
        })
        currentWeek = []
      }
    })

    return weeks
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const week1 = this.getWeekRange(date1)
    const week2 = this.getWeekRange(date2)
    return week1.start.getTime() === week2.start.getTime()
  }

  private formatAriaLabel(date: Date): string {
    return new Intl.DateTimeFormat(this.state.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }
}
