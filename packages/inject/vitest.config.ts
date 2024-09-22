import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom' // Use jsdom as the test environment
    // setupFiles: './test/setup.ts', // (Optional) Path to setup file if needed
    // globals: true // (Optional) Enables using Vitest's global API
  }
})
