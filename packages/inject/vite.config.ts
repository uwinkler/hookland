import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite' // Import the 'resolve' function

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true
  },
  build: {
    lib: {
      entry: './src',
      name: 'hookland-inject',
      formats: ['es']
    }
  }
})
