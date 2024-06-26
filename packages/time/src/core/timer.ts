import { Store } from '@tanstack/store'
import { TimeCore } from './time'
import type { TimeCoreOptions, TimeState } from './time'

interface TimerOptions extends TimeCoreOptions {
  /**
   * The initial time for the timer.
   * @default 0
   */
  initialTime: number
  /**
   * A callback that is called when the timer finishes.
   */
  onFinished?: () => void
}

interface TimerState extends TimeState {
  /**
   * The remaining time for the timer.
   * @default 0
   * @readonly
   * @type number
   */
  remainingTime: number
  /**
   * Whether the timer is running.
   * @default false
   * @readonly
   * @type boolean
   */
  isRunning: boolean
}

export interface TimerActions {
  /**
   * Start the timer.
   */
  start: () => void
  /**
   * Stop the timer.
   */
  stop: () => void
  /**
   * Reset the timer.
   */
  reset: () => void
}

export interface TimerApi extends TimerActions, TimerState {}

export class Timer extends TimeCore<TimerState> implements TimerActions {
  private options: TimerOptions

  constructor(options: TimerOptions) {
    super(options)
    this.options = options
    this.store = new Store<TimerState>({
      remainingTime: options.initialTime,
      isRunning: false,
      currentTime: this.store.state.currentTime,
    })
  }

  start() {
    if (!this.store.state.isRunning) {
      this.store.setState((prev) => ({
        ...prev,
        isRunning: true,
      }))
      this.startUpdatingTime(1000)
    }
  }

  stop() {
    if (this.store.state.isRunning) {
      this.store.setState((prev) => ({
        ...prev,
        isRunning: false,
      }))
      this.stopUpdatingTime()
    }
  }

  reset() {
    this.stop()
    this.store.setState((prev) => ({
      ...prev,
      remainingTime: this.options.initialTime,
    }))
  }

  protected updateCurrentTime() {
    super.updateCurrentTime()
    if (this.store.state.isRunning && this.store.state.remainingTime > 0) {
      this.store.setState((prev) => ({
        ...prev,
        remainingTime: prev.remainingTime - 1,
      }))
      if (this.store.state.remainingTime <= 0) {
        this.stop()
        this.options.onFinished?.()
      }
    }
  }
}
