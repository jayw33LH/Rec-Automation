import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@anthropic-ai/sdk', 'mammoth'],
    exclude: ['pdfjs-dist'],
  },
  worker: {
    format: 'es',
  },
});
