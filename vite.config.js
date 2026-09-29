import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES_BUILD ? '/card-activator/' : '/',
  build: {
    outDir: process.env.GITHUB_PAGES_BUILD ? 'docs' : 'dist',
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
