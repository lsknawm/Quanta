import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MockExam from '@/views/MockExam.vue'
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
      component: () => import('../views/ExamView.vue')
    },
    // --- 新增预览路由 ---
    {
      path: '/preview-card',
      name: 'preview-card',
      component: () => import('../views/CardPreview.vue')
    },
    {
      path: '/mock-exam',
      name: 'mock-exam',
      component: MockExam
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
