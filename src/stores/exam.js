// src/stores/exam.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import quizApi from '../api/quiz'

export const useExamStore = defineStore('exam', () => {
  // --- State (状态) ---
  const questions = ref([])
  const userAnswers = ref({})
  const validationResults = ref({})

  const currentIndex = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  // --- Getters (计算属性) ---
  const currentQuestion = computed(() => {
    if (!questions.value.length) return null
    return questions.value[currentIndex.value]
  })

  const progressPercentage = computed(() => {
    if (!questions.value.length) return 0
    return ((currentIndex.value + 1) / questions.value.length) * 100
  })

  const isLastQuestion = computed(() => {
    return questions.value.length > 0 && currentIndex.value === questions.value.length - 1
  })

  const isFirstQuestion = computed(() => currentIndex.value === 0)

  // --- Actions (动作) ---

  // 初始化考试
// 初始化考试
  async function initExam(params) {
    isLoading.value = true
    error.value = null
    questions.value = []
    userAnswers.value = {}
    validationResults.value = {}
    currentIndex.value = 0

    try {
      const res = await quizApi.generateQuiz(params)
      console.log('API Response:', res) // 调试日志

      let list = []

      // --- 增强数据解析逻辑 ---
      if (Array.isArray(res)) {
        // 1. 直接返回数组
        list = res
      } else if (res && Array.isArray(res.data)) {
        // 2. 标准包装 { code: 200, data: [...] }
        list = res.data
      } else if (res && Array.isArray(res.questions)) {
        // 3. 语义化包装 { questions: [...] }
        list = res.questions
      } else if (res && Array.isArray(res.quiz)) {
        // 4. [新增] 适配当前后端格式 { count: 1, quiz: [...] }
        list = res.quiz
      } else {
        console.warn('API返回格式无法识别:', res)
        throw new Error('Invalid response format')
      }

      if (list.length === 0) {
        console.log('后端返回了空题库')
      }
      questions.value = list

    } catch (err) {
      console.error('InitExam Error:', err)
      if (err.message === 'Invalid response format') {
        error.value = '数据解析失败：格式不匹配'
      } else {
        error.value = '无法生成试卷，请检查网络或后端服务。'
      }
    } finally {
      isLoading.value = false
    }
  }

  // 记录用户作答
  function setAnswer(questionId, answer) {
    userAnswers.value[questionId] = answer
  }

  // 提交单题判分
  async function checkCurrentAnswer() {
    const q = currentQuestion.value
    const ans = userAnswers.value[q.id]

    if (!ans) return

    try {
      const result = await quizApi.validateAnswer(q.id, ans)
      validationResults.value[q.id] = result
      return result
    } catch (err) {
      console.error('Validation failed', err)
    }
  }

  // 导航
  function nextQuestion() {
    if (!isLastQuestion.value) currentIndex.value++
  }

  function prevQuestion() {
    if (!isFirstQuestion.value) currentIndex.value--
  }

  // --- Return (导出) ---
  // 必须在 defineStore 的回调函数末尾返回所有需要暴露的属性和方法
  return {
    questions,
    userAnswers,
    validationResults,
    currentIndex,
    isLoading,
    error,
    currentQuestion,
    progressPercentage,
    isLastQuestion,
    isFirstQuestion,
    initExam,
    setAnswer,
    checkCurrentAnswer,
    nextQuestion,
    prevQuestion
  }
})

