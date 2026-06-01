import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { brigada360DevApi } from './src/dev-server'

export default defineConfig({
  plugins: [react(), brigada360DevApi()],
  server: {
    port: 5173,
  },
})
