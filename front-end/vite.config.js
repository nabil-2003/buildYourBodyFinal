import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    allowedHosts: [
      'b74635d3f0c2.ngrok-free.app'  // ← add your ngrok domain here
    ],
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.venv/**',
        '**/rasa_env/**',
        '**/rasa_env_310/**',
        '**/buildyourbody-rasa/**',
        '**/backend/target/**',
        '**/__pycache__/**',
        '**/models/**',
        '**/.git/**'
      ]
    },

    proxy: {
      '/api': 'http://localhost:8080',
      
    },
  }
})
