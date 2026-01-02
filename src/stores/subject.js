import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  // 状态：学科列表
  const subjects = ref([])
  const isLoading = ref(false)

  // 初始化：优先读缓存，再静默请求
  async function initData() {
    const cached = localStorage.getItem('quanta_subjects')
    if (cached) {
      try {
        subjects.value = JSON.parse(cached)
      } catch (e) {
        console.error('Cache parse error', e)
      }
    }

    // 如果没有缓存或需要更新，可以在这里发起请求
    // 为了用户体验，我们总是尝试后台刷新一下最新数据
    await fetchInfo()
  }

  // 从后端获取数据
  async function fetchInfo() {
    isLoading.value = true
    try {
      // 假设后端地址，如果配置了代理请用相对路径 /api/info
      const res = await fetch('http://localhost:8080/api/info')
      if (!res.ok) throw new Error('API Error')

      const json = await res.json()
      if (json.code === 200 && json.data) {
        subjects.value = json.data
        // 更新缓存
        localStorage.setItem('quanta_subjects', JSON.stringify(json.data))
      }
    } catch (err) {
      console.error('Fetch info failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { subjects, isLoading, initData, fetchInfo }
})
