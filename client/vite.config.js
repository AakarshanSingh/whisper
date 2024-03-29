import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { CLIENT_URL, SERVER_URL } from './global';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: SERVER_URL,
        changeOrigin: true,
      },
    },
    port: 8080,
    strictPort: true,
    host: true,
    origin: CLIENT_URL,
  },
});
