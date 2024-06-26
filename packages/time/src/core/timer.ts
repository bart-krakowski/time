import { Store } from '@tanstack/store'
import { TimeCore } from './time'
import type { TimeCoreOptions, TimeState } from './time'

export interface TimerOptions extends TimeCoreOptions {
  /**
   * The initial time for the timer.
   * @default 0
   */
  initialTime: number
  /**
   * A callback that is called when the timer finishes.
   */
  onFinish?: () => void
  /**
   * A callback that is called when the timer finishes.
   */
  onStart?: () => void
  /**
   * A callback that is called when the timer stops.
   */
  onStop?: () => void
  /**
   * A callback that is called when the timer resets.
   */
  onReset?: () => void
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
      this.options.onStart?.()
    }
  }

  stop() {
    if (this.store.state.isRunning) {
      this.store.setState((prev) => ({
        ...prev,
        isRunning: false,
      }))
      this.stopUpdatingTime()
      this.options.onStop?.()
    }
  }

  reset() {
    this.stop()
    this.store.setState((prev) => ({
      ...prev,
      remainingTime: this.options.initialTime,
    }))
    this.options.onReset?.()
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
        this.options.onFinish?.()
      }
    }
  }
}
