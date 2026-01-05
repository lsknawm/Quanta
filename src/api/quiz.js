// src/api/quiz.js

const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * 通用 Fetch 封装，处理 JSON 头和错误
 */
async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // 处理 4xx, 5xx 错误
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // 对于 204 No Content 等情况需特殊处理，这里默认都返回 JSON
    return await response.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err; // 继续抛出，让 Store 处理 UI 反馈
  }
}

export default {
  // 3.1 随机生成试卷
  generateQuiz(params) {
    // params: { subject, count, difficulty }
    return client('/quiz/generate', { body: params });
  },

  // 3.2 提交答案并判分
  validateAnswer(questionId, userAnswer) {
    return client('/quiz/validate', {
      body: {
        question_id: questionId,
        user_answer: userAnswer
      }
    });
  },

  // 3.3 获取解析 (如果需要单独获取)
  getExplanation(questionId) {
    return client(`/quiz/${questionId}/explanation`);
  }
};
