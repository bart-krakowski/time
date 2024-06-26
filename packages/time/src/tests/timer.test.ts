import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from '../core/timer';
import type { TimerOptions } from '../core/timer';

describe('Timer', () => {
  let timer: Timer;
  const onFinish = vi.fn();
  const onStart = vi.fn();
  const onStop = vi.fn();
  const onReset = vi.fn();
  const initialTime = 5;
  
  beforeEach(() => {
    vi.useFakeTimers();

    const options: TimerOptions = {
      initialTime,
      onFinish,
      onStart,
      onStop,
      onReset,
      timeZone: 'America/New_York',
    };

    timer = new Timer(options);
  });

  it('should initialize with the correct remaining time and isRunning state', () => {
    expect(timer.store.state.remainingTime).toBe(initialTime);
    expect(timer.store.state.isRunning).toBe(false);
  });

  it('should start the timer', () => {
    timer.start();
    expect(timer.store.state.isRunning).toBe(true);
    expect(onStart).toHaveBeenCalled();
  });

  it('should stop the timer', () => {
    timer.start();
    timer.stop();
    expect(timer.store.state.isRunning).toBe(false);
    expect(onStop).toHaveBeenCalled();
  });

  it('should reset the timer', () => {
    timer.start();
    timer.reset();
    expect(timer.store.state.isRunning).toBe(false);
    expect(timer.store.state.remainingTime).toBe(initialTime);
    expect(onReset).toHaveBeenCalled();
  });

  it('should call onFinish when the timer reaches zero', () => {
    timer.start();
    vi.advanceTimersByTime(initialTime * 1000);
    expect(timer.store.state.remainingTime).toBe(0);
    expect(onFinish).toHaveBeenCalled();
    expect(timer.store.state.isRunning).toBe(false);
  });

  it('should decrement the remaining time every second when running', () => {
    timer.start();
    vi.advanceTimersByTime(3000);
    expect(timer.store.state.remainingTime).toBe(2);
  });
});
