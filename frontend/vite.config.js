import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Both servers forward /api to the Go backend, stripping the /api prefix
// (the backend mounts its routes at the root: /projects, /tasks, /search).
//
//   server.proxy  → `npm run dev` (local dev on :5173) → backend on localhost:8080
//   preview.proxy → `npm run preview` (the Docker container) → backend on the
//                   compose network, reachable by its service name `backend`.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    // Vite blocks arbitrary Host headers by default (DNS rebinding
    // protection). Behind a public ingress with a real hostname, that
    // hostname needs to be explicitly allowed or every request 403s.
    allowedHosts: [
      'devboard.15-252-151-45.sslip.io',
      'api.devboard.15-252-151-45.sslip.io',
    ],
    proxy: {
      '/api': {
        // `backend` is the compose service name; 8080 is its container port and
        // must match BACKEND_PORT in .env (the port the Go app listens on).
        target: 'http://backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
});