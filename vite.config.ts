import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() ],
  server: { // Ajoutez cette section
    host: true, // Important pour Docker
    port: 3000, // Port exposé dans Docker
    proxy: {
      // Redirige les requêtes commençant par /api vers le backend
      '/api': {
        target: 'http://backend:8000', // Utilise le nom du service backend défini dans docker-compose.yml
        changeOrigin: true,
        // secure: false, // Décommentez si votre backend n'a pas de HTTPS valide (pas pertinent ici) 
        // rewrite: (path) => path.replace(/^\/api/, '') // Décommentez si votre backend n'attend pas /api dans l'URL
      }
    }
  }
})
