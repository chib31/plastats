import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Dev: forward API calls to the NestJS backend (avoids CORS + hardcoded URLs).
      '/api': 'http://localhost:3000',
    },
  },
});
