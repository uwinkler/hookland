import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import injectablePlugin from './src/plugins/injectable'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectablePlugin()]
})
