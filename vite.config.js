import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
// 引入自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    // 配置自动导入 API (如 ref, computed, watch 等) 和 Element Plus 相关函数
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
    }),
    // 配置自动导入组件 (如 ElCard, ElButton 等)
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass', // 如果你使用 scss，这里可以配置，或者默认 'css'
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 捕获所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:8080', // 后端真实地址
        changeOrigin: true, // 允许跨域
        // 如果后端接口本身就包含 /api 前缀（看你的 interface.http 是有的），则不需要 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
