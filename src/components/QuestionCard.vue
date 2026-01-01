<template>
  <div class="question-card-placeholder">
    <div class="placeholder-content">
      <h3>题目 {{ index + 1 }} - 待重构</h3>
      <p>当前题型: <span class="tag">{{ question.type }}</span></p>
      <p class="id-text">ID: {{ question.id }}</p>
    </div>
  </div>
</template>

<script setup>
// 只要保留 props 定义，Vue 就不会报错
defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.question-card-placeholder {
  padding: 30px;
  margin-bottom: 24px;
  border: 2px dashed #e5e7eb; /* 虚线边框表示“待办”状态 */
  border-radius: 12px;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-content {
  text-align: center;
  color: #9ca3af;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #6b7280;
}

.tag {
  background: #eee;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  color: #333;
}

.id-text {
  font-size: 0.8rem;
  margin-top: 5px;
  opacity: 0.6;
}
</style>
