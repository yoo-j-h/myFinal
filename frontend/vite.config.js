import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅ 추가: global 치환(런타임)
  define: {
    global: 'globalThis',
  },

  // ✅ 추가: global 치환(사전 번들링 단계)
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // 경로를 그대로 유지
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('프록시 에러:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('프록시 요청:', req.method, req.url);
            // 쿼리 파라미터가 제대로 전달되는지 확인
            if (req.url.includes('token=')) {
              console.log('토큰 포함된 요청:', req.url);
            }
          });
        },
      }
    }
  }
})
