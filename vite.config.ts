import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import pkg from './package.json' with { type: 'json' };

// Derive base for GitHub Pages automatically when running in Actions
// If repository is <user>/<user>.github.io -> base '/' else '/<repo>/'
const repoFull = process.env.GITHUB_REPOSITORY;
const isGhActions = !!process.env.GITHUB_ACTIONS;
let computedBase = '/Euchre/';
if (isGhActions && repoFull) {
  const [, repoName] = repoFull.split('/');
  const isUserSite = /\.github\.io$/i.test(repoName);
  computedBase = isUserSite ? '/' : `/${repoName}/`;
}

export default defineConfig({
  // Base path for GitHub Pages project or user site.
  base: computedBase,
  plugins: [react(), svgr()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'jsdom',
    setupFiles: [],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});


