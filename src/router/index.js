// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 1. 首页通常需要快速加载，所以使用静态导入 (Static Import)
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/exam',
      name: 'exam',
      // 2. 核心业务页面：路由懒加载 (Lazy Loading)
      // 只有当用户点击“开始生成试卷”并跳转到 /exam 时，才会下载这个组件的代码
      component: () => import('../views/ExamView.vue')
    },

    // --- 开发调试路由 (Dev/Debug Routes) ---
    // 这些页面在生产环境可能很少访问，必须使用懒加载，避免拖慢首屏
    {
      path: '/mock-exam',
      name: 'mock-exam',
      component: () => import('../views/MockExam.vue')
    },
    {
      path: '/preview-card',
      name: 'preview-card',
      component: () => import('../views/CardPreview.vue')
    }
  ],

  // 3. 滚动行为优化 (Scroll Behavior)
  // 确保切换页面时，视口总是回到顶部，除非是浏览器的“后退”操作
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
