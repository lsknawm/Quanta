<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const showAnswer = ref(false)
const cardRef = ref(null)

// 封装渲染函数
const renderMath = () => {
  if (window.renderMathInElement && cardRef.value) {
    window.renderMathInElement(cardRef.value, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    })
  }
}

// 组件挂载时渲染一次（针对题目内容）
onMounted(() => {
  renderMath()
})

// 切换答案时，等待 DOM 更新后重新渲染（针对答案和解析）
const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value
  await nextTick()
  renderMath()
}
</script>

<template>
  <div class="question-card" ref="cardRef">
    <div class="card-header">
      <div class="meta-left">
        <span class="question-badge">Q{{ index + 1 }}</span>
        <span class="difficulty-badge" :class="question.difficulty.toLowerCase()">
          {{ question.category || 'General' }}
        </span>
      </div>
      <span class="difficulty-text">难度: {{ question.difficulty }}</span>
    </div>

    <div class="question-content">
      <p v-html="question.content"></p>
    </div>

    <div v-if="question.type === 'choice'" class="options-list">
      <div
        v-for="(option, idx) in question.options"
        :key="idx"
        class="option-item"
        @click="!showAnswer && (selectedOption = idx)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + idx) }}.</span>
        <span class="option-text" v-html="option"></span>
      </div>
    </div>

    <div class="card-footer">
      <button @click="toggleAnswer" class="toggle-btn">
        {{ showAnswer ? '隐藏解析' : '查看答案与解析' }}
      </button>

      <transition name="fade">
        <div v-if="showAnswer" class="answer-panel">
          <div class="answer-row">
            <span class="label">正确答案：</span>
            <span class="answer-key">{{ question.answer }}</span>
          </div>
          <div class="explanation-row">
            <div class="label">解析：</div>
            <div class="explanation-content" v-html="question.explanation"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: #ffffff;
  border: 1px solid #eef0f2;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.question-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: #e0e6eb;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.meta-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.question-badge {
  font-family: 'SF Mono', monospace;
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.9rem;
}

.difficulty-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: #f1f5f9;
  color: #475569;
}

.question-content {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #1e293b;
  margin-bottom: 24px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.option-item {
  display: flex;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.option-item:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.option-label {
  font-weight: 700;
  color: #6366f1;
  margin-right: 12px;
  min-width: 20px;
}

.toggle-btn {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.answer-panel {
  margin-top: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.answer-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.answer-key {
  font-weight: 700;
  color: #15803d;
  font-size: 1.1rem;
}

.label {
  font-weight: 600;
  color: #64748b;
  margin-right: 8px;
  min-width: 60px;
}

.explanation-content {
  color: #334155;
  line-height: 1.8;
  font-size: 0.95rem;
}

/* 简单的淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
