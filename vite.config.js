import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.RENDER ? '0.0.0.0' : 'localhost', // Usa 'localhost' en desarrollo y '0.0.0.0' en Render
    port: process.env.PORT || 5173 // Usa el puerto de Render o 5173 en local
  }
})

