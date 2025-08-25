import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
  plugins: [
    react(),
    // REMOVE tailwindcss() if it's here
  ],
})