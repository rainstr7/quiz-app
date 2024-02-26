import {babel} from '@rollup/plugin-babel';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';


export default defineConfig({
  plugins: [
    babel({extensions: ['.ts', '.tsx'], babelHelpers: 'bundled', skipPreflightCheck: true}),
    react({fastRefresh: false}),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:31299',
        changeOrigin: true,
      },
    },
  },
});
