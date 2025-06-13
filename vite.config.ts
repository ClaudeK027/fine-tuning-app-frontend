import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true, // Listen on all addresses, including 0.0.0.0
    port: 5173,
    hmr: {
      clientPort: 5173,
    },
  },
});
