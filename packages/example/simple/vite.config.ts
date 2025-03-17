import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fixtures } from './vite-fixture.plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), fixtures()]
})
