import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// 懒加载 ExamView，提升首屏速度
const ExamView = () => import('../views/ExamView.vue')

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
      component: ExamView
    }
  ]
})

export default router
