import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite' // Import the 'resolve' function
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src',
      name: 'hookland-inject',
      formats: ['es']
    }
  }
})
