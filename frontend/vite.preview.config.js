// Used only when serving the built app with `vite preview` inside the Docker
// image. It forwards /api to the backend — the same job nginx would do.
export default {
  preview: {
    // Vite blocks arbitrary Host headers by default (DNS rebinding
    // protection). Since we're behind a public ingress with a real
    // hostname, that hostname needs to be explicitly allowed.
    allowedHosts: [
      'devboard.15-252-151-45.sslip.io',
      'api.devboard.15-252-151-45.sslip.io',
    ],
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
