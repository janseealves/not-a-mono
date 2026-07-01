import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VPS_ORIGIN vem do .env (gitignored) — o endereço da VPS não fica no fonte.
  const env = loadEnv(mode, process.cwd(), '')
  const vpsOrigin = env.VPS_ORIGIN || 'http://localhost:8000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Espelha o proxy de produção (função em /api): /api → VPS, mesma origem.
      proxy: {
        '/api': {
          target: vpsOrigin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
