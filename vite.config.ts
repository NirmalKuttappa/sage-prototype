import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5180 is easy to collide with stale `vite` processes (wrong Node / wrong lockfile),
  // which often surface in the browser as "Internal Server Error" for `/src/*`.
  server: { port: 5190, host: true, strictPort: false },
})
