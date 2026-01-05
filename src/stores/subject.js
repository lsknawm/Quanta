import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  // 状态：科目列表 (现在是字符串数组，例如 ["English", "Math"])
  const subjects = ref([])
  const isLoading = ref(false)

  // 初始化
  async function initData() {
    // 简单缓存策略
    const cached = localStorage.getItem('quanta_subjects_v1')
    if (cached) {
      try {
        subjects.value = JSON.parse(cached)
      } catch (e) {
        console.error('Cache parse error', e)
      }
    }
    await fetchInfo()
  }

  // 从后端获取数据
  async function fetchInfo() {
    isLoading.value = true
    try {
      // 根据 interface.http 更新 API 路径
      const res = await fetch('http://localhost:8080/api/v1/meta/subjects')
      if (!res.ok) throw new Error('API Error')

      const json = await res.json()
      // 接口返回结构为 { "subjects": [...] }
      if (json.subjects) {
        subjects.value = json.subjects
        localStorage.setItem('quanta_subjects_v1', JSON.stringify(json.subjects))
      }
    } catch (err) {
      console.error('Fetch info failed:', err)
      // 开发环境兜底数据，方便你调试 UI
      if (subjects.value.length === 0) {
        subjects.value = ['计算机科学', 'English', '前端开发', '高等数学']
      }
    } finally {
      isLoading.value = false
    }
  }

  return { subjects, isLoading, initData, fetchInfo }
})
