import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function hashPathSafeDevPlugin(): Plugin {
  const rootDir = import.meta.dirname;
  return {
    name: 'hash-path-safe-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/@vite/client') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.end(
            'export const injectQuery = (u) => u;\n' +
            'export const createHotContext = () => ({ accept(){}, prune(){}, dispose(){}, decline(){}, invalidate(){}, on(){}, off(){}, send(){} });\n' +
            'export const updateStyle = () => {};\n' +
            'export const removeStyle = () => {};\n'
          );
          return;
        }
        if (url === '/favicon.ico') {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (url === '/src/main.tsx') {
          try {
            const cssPath = path.join(rootDir, 'src', 'index.css');
            const rawCss = fs.existsSync(cssPath)
              ? fs.readFileSync(cssPath, 'utf8').replace(/@import\s+["']tailwindcss["'];?/g, '')
              : '';
            const result = await esbuild.build({
              entryPoints: [path.join(rootDir, 'src', 'main.tsx')],
              bundle: true,
              format: 'esm',
              write: false,
              jsx: 'automatic',
              loader: { '.tsx': 'tsx', '.ts': 'ts', '.css': 'text' },
              absWorkingDir: rootDir,
            });
            const jsCode = result.outputFiles[0].text;
            const injectCssCode = `
(function(){
  var st = document.getElementById('__vite_hash_safe_css');
  if (!st) {
    st = document.createElement('style');
    st.id = '__vite_hash_safe_css';
    document.head.appendChild(st);
  }
  st.textContent = ${JSON.stringify(rawCss)};
})();
`;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.end(injectCssCode + '\n' + jsCode);
            return;
          } catch (err) {
            console.error('esbuild middleware error:', err);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [hashPathSafeDevPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
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
