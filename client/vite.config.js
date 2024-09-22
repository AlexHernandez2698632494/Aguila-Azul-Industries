import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite que el servidor escuche en todas las interfaces
    port: 5173, // Opcional: define el puerto si lo necesitas
  },
});
