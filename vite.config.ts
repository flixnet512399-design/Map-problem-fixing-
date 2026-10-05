import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import {createApiApp} from './server/api.ts';

export default defineConfig(({ command }) => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  // Use repository subpath for GitHub Pages in CI, or relative/root in dev
  const base = process.env.BASE_PATH || (isGitHubActions ? '/Map-problem-fixing/' : '/');

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(createApiApp());
        },
      },
      {
        name: 'generate-404-html',
        closeBundle() {
          const distDir = path.resolve(process.cwd(), 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const notFoundPath = path.join(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, notFoundPath);
            console.log('[build] Generated dist/404.html for GitHub Pages SPA routing.');
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
