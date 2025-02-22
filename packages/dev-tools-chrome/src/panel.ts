import { createTinyState } from '@hookland/tiny-state'
import { useEffect } from 'react'

export const useState = createTinyState({})

function useConnectToBackgroundScript() {
  return useEffect(() => {
    const port = chrome.runtime.connect({ name: 'DevDuck' })

    port.onMessage.addListener((msg) => {
      console.log('Message from background:', msg)
    })

    port.postMessage({ greeting: 'Hello from panel script' })

    return () => port.disconnect()
  }, [])
}
