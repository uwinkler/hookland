import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite' // Import the 'resolve' function

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    }
  }
})
