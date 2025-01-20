import { createInjectableHook } from '@hookland/inject'
import Fireworks from 'fireworks-js'
import React from 'react'

export const useFireworks = createInjectableHook(() => {
  const fireworks = React.useMemo(() => {
    const container = document.getElementById('fireworks')
    return new Fireworks(container!)
  }, [])

  const start = React.useCallback(() => {
    fireworks.start()
  }, [fireworks])

  const stop = React.useCallback(() => {
    fireworks.waitStop()
  }, [fireworks])

  return { start, stop }
})
