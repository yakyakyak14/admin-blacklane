import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mainassets': path.resolve(__dirname, '../src/assets'),
    },
  },
  server: {
    fs: {
      // allow importing assets from the main project folder
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
