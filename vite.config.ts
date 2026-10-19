import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: 'src/sharing/PropertySharing.tsx',
      formats: ['es'],
      fileName: () => 'assets/PropertySharing.js',
      cssFileName: 'assets/PropertySharing',
    },
  },
})
