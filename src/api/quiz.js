// src/api/quiz.js

// 读取 .env 中的配置，如果未配置则回退到 localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/**
 * 通用请求客户端
 * @param {string} endpoint - 接口路径 (例如 /quiz/generate)
 * @param {object} options - 配置项 (body, headers, method...)
 */
async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    // 可以在这里统一添加 Token，例如: 'Authorization': `Bearer ${token}`
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    // 统一处理 HTTP 错误状态
    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`API Error [${response.status}]: ${response.statusText} - ${errorBody}`)
    }

    // 处理 204 No Content
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (err) {
    console.error('API Request Failed:', err)
    // 这里可以接入统一的 Message 提示，例如 ElementPlus 的 ElMessage.error(err.message)
    throw err
  }
}

export default {
  // 获取所有科目
  getSubjects() {
    return client('/meta/subjects')
  },

  // 获取标签
  getTags() {
    return client('/meta/tags')
  },

  // 3.1 随机生成试卷
  generateQuiz(params) {
    // params: { subject, count, difficulty }
    return client('/quiz/generate', { body: params })
  },

  // 3.2 提交答案并判分
  validateAnswer(questionId, userAnswer) {
    return client('/quiz/validate', {
      body: {
        question_id: questionId,
        user_answer: userAnswer
      }
    })
  },

  // 3.3 获取单题解析
  getExplanation(questionId) {
    return client(`/quiz/${questionId}/explanation`)
  },

  // 4.1 获取题目列表 (CMS用)
  getQuestionsList(queryParams = {}) {
    // 将对象转换为 query string
    const searchParams = new URLSearchParams(queryParams).toString()
    return client(`/questions?${searchParams}`)
  }
}
