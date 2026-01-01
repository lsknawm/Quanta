<template>
  <div class="exam-container">
    <div class="content-wrapper">
      <h2 class="page-title">Exam Mode</h2>
      <QuestionCard
        v-for="(q, index) in questions"
        :key="q.id"
        :question="q"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup>
// 这里粘贴你原来 App.vue 里的 <script setup> 内容
import { ref, onMounted } from 'vue'
import QuestionCard from '@/components/QuestionCard.vue'
import questionsData from '@/data/questions.json'

const questions = ref(questionsData)

// 如果有 Latex 渲染逻辑 (renderMathInElement)，也一起移过来
onMounted(() => {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false
    });
  }
})
</script>

<style scoped>
/* 这里粘贴你原来 App.vue 里的相关样式 */
.exam-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #111;
}
</style>
