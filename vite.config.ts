import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Em desenvolvimento o front (5173) repassa /api para o Express local (3001),
  // então o navegador nunca chama o back direto: mesma origem, sem CORS no dia a dia.
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
