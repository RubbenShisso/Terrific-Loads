import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Only public/ is copied into dist. client-assets/ is never imported or copied.
// The server build (used only to prerender HTML) skips public/ entirely.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    copyPublicDir: !isSsrBuild,
    // Lets the prerender step add modulepreload links for each page's chunk.
    manifest: !isSsrBuild,
  },
}))
