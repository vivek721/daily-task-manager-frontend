import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// The app calls the backend directly at VITE_API_URL (see src/config.ts),
// so no dev proxy is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,
  },
})
