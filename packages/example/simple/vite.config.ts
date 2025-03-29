import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import injectablePlugin from './src/plugins/injectable'
import pebblePlugin from './src/plugins/pebble'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectablePlugin(), pebblePlugin()]
})
