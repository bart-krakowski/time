import { useStore } from '@tanstack/react-store'
import { Timer, type TimerApi, type TimerOptions } from '@tanstack/time'
import { useCallback, useState } from 'react'

export const useTimer = (options: TimerOptions): TimerApi => {
  const [timer] = useState(() => new Timer(options))
  const state = useStore(timer.store)

  const start = useCallback<typeof timer.start>(() => {
    timer.start()
  }, [timer])

  const stop = useCallback<typeof timer.stop>(() => {
    timer.stop()
  }, [timer])

  const reset = useCallback<typeof timer.reset>(() => {
    timer.reset()
  }, [timer])

  return { ...state, start, stop, reset }
}
