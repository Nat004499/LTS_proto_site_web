import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT pour GitHub Pages :
// Remplacer "fissuro-monitor" par le nom EXACT de ton repository GitHub.
// En local (npm run dev), ça n'a aucune importance.
export default defineConfig({
  plugins: [react()],
  base: '/fissuro-monitor/',
})
