import { Temporal } from '@js-temporal/polyfill'
import { Store } from '@tanstack/store'
import { getDefaultTimeZone } from '../utils/dateDefaults'

export interface TimeCoreOptions {
  /**
   * The time zone to use for the current time.
   * @default Intl.DateTimeFormat().resolvedOptions().timeZone
   */
  timeZone?: Temporal.TimeZoneLike
}

interface TimeState {
  /**
   * The current time.
   * @default Temporal.Now.zonedDateTimeISO()
   * @readonly
   * @type Temporal.ZonedDateTime
   */
  currentTime: Temporal.ZonedDateTime
}

export abstract class TimeCore {
  protected store: Store<TimeState>
  protected interval: NodeJS.Timeout | null = null
  protected timeZone: Temporal.TimeZoneLike

  constructor(options: TimeCoreOptions = {}) {
    const defaultTimeZone = getDefaultTimeZone()
    this.timeZone = options.timeZone || defaultTimeZone
    this.store = new Store<TimeState>({
      currentTime: Temporal.Now.zonedDateTimeISO(this.timeZone),
    })
    this.updateCurrentTime()
  }

  protected updateCurrentTime() {
    this.store.setState((prev) => ({
      ...prev,
      currentTime: Temporal.Now.zonedDateTimeISO(this.timeZone),
    }))
  }

  startUpdatingTime(intervalMs: number = 1000) {
    if (!this.interval) {
      this.interval = setInterval(() => this.updateCurrentTime(), intervalMs)
    }
  }

  stopUpdatingTime() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  getCurrentTime(): Temporal.ZonedDateTime {
    return this.store.state.currentTime
  }
}
