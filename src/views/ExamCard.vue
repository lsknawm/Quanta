<template>
  <div class="exam-container">
    <div class="content-wrapper">
      <header class="exam-header">
        <h2 class="page-title">Exam Mode</h2>
        <span class="question-count">共 {{ questions.length }} 题</span>
      </header>

      <div class="questions-list">
        <QuestionCard
          v-for="(q, index) in questions"
          :key="q.id"
          :question="q"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import QuestionCard from '@/components/QuestionCard.vue'
// 修正：指向正确的文件名 raw_questions.json
import questionsData from '@/data/raw_questions.json'

const questions = ref(questionsData)

onMounted(() => {
  // 确保 DOM 更新后再渲染数学公式
  nextTick(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
      });
    }
  })
})
</script>

<style scoped>
.exam-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff; /* 确保背景纯白适应 E-Ink 风格 */
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 30px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 10px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.question-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 40px; /* 题目之间的间距 */
}
</style>
