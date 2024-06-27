import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimer } from '../useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('should start the timer', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 5 }))
    act(() => {
      result.current.start()
    })
    expect(result.current.isRunning).toBe(true)
  })

  test('should stop the timer', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 5 }))
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.stop()
    })
    expect(result.current.isRunning).toBe(false)
  })

  test('should reset the timer', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 5 }))
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.stop()
    })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingTime).toBe(5)
  })

  test('should update the remaining time', () => {
    const { result } = renderHook(() => useTimer({ initialTime: 5 }))
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.remainingTime).toBe(4)
  })

  test('should call onStart callback', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useTimer({ initialTime: 5, onStart }))
    act(() => {
      result.current.start()
    })
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  test('should call onStop callback', () => {
    const onStop = vi.fn()
    const { result } = renderHook(() => useTimer({ initialTime: 5, onStop }))
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.stop()
    })
    expect(onStop).toHaveBeenCalledTimes(1)
  })

  test('should call onReset callback', () => {
    const onReset = vi.fn()
    const { result } = renderHook(() => useTimer({ initialTime: 5, onReset }))
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.stop()
    })
    act(() => {
      result.current.reset()
    })
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  test('should call onFinish callback', () => {
    const onFinish = vi.fn()
    const { result } = renderHook(() => useTimer({ initialTime: 5, onFinish }))
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onFinish).toHaveBeenCalledTimes(1)
  })
})
