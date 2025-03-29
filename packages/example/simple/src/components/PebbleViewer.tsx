// @ts-expect-error virtual module is provided by vite plugin
import { pebbleFunctions } from 'virtual:pebble-list'

export function PebbleViewer() {
  return (
    <div>
      <h1>Pebble Viewer</h1>
      <code>{JSON.stringify(pebbleFunctions, null, 2)}</code>
    </div>
  )
} 