<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import { VideoPlay, ArrowDown, Check, CircleCheck, CircleClose, Promotion } from '@element-plus/icons-vue'

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true }
})

const selectedOption = ref(null)
const showAnswer = ref(false)
const hasSubmitted = ref(false)

// 修改 1: 不再使用单一的大容器 ref，而是拆分为题目和选项的 ref
const questionTextRef = ref(null)
const optionRefs = ref([]) // 这是一个数组，用来存储所有选项内容的 DOM
const answerRef = ref(null)

const correctIndex = computed(() => {
  if (!props.question.answer) return -1
  return props.question.answer.charCodeAt(0) - 65
})

const isCorrect = computed(() => {
  return hasSubmitted.value && selectedOption.value === correctIndex.value
})

const katexOptions = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false},
    {left: '\\(', right: '\\)', display: false},
    {left: '\\[', right: '\\]', display: true}
  ],
  throwOnError: false
}

const renderArea = (element) => {
  if (element) renderMathInElement(element, katexOptions)
}

onMounted(() => {
  // 修改 2: 精准渲染，只渲染题目文本和选项内容，避开 Vue 管理的 Marker
  renderArea(questionTextRef.value)
  if (optionRefs.value) {
    optionRefs.value.forEach(el => renderArea(el))
  }
})

const submitAnswer = () => {
  if (selectedOption.value === null) return
  hasSubmitted.value = true

  if (!isCorrect.value && !showAnswer.value) {
    toggleAnswer()
  }
}

const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value
  if (showAnswer.value) {
    await nextTick()
    if (answerRef.value) {
      renderArea(answerRef.value)
    }
  }
}

const handleOptionClick = (idx) => {
  if (hasSubmitted.value) return
  selectedOption.value = idx
}

const getDiffColor = (diff) => {
  const map = { 'A': 'success', 'B': 'info', 'C': 'warning', 'D': 'danger' }
  return map[diff] || 'info'
}
</script>

<template>
  <div class="card-container">
    <div class="card-header">
      <div class="header-main">
        <span class="question-number">Question {{ index + 1 }}</span>
        <el-tag :type="getDiffColor(question.difficulty)" size="small" effect="plain" round class="diff-tag">
          {{ question.category }} · 难度 {{ question.difficulty }}
        </el-tag>
      </div>
      <transition name="el-fade-in">
        <el-tag v-if="hasSubmitted" :type="isCorrect ? 'success' : 'danger'" effect="dark" round>
          {{ isCorrect ? '回答正确' : '回答错误' }}
        </el-tag>
      </transition>
    </div>

    <div class="card-body">
      <div class="question-text" ref="questionTextRef" v-html="question.content"></div>

      <div class="options-list" v-if="question.type === 'choice'">
        <div
          v-for="(option, idx) in question.options"
          :key="idx"
          class="option-item"
          :class="{
            'is-selected': selectedOption === idx && !hasSubmitted,
            'is-correct-highlight': hasSubmitted && idx === correctIndex,
            'is-wrong-highlight': hasSubmitted && selectedOption === idx && idx !== correctIndex,
            'is-disabled': hasSubmitted
          }"
          @click="handleOptionClick(idx)"
        >
          <div class="option-marker">
            <template v-if="hasSubmitted">
              <el-icon v-if="idx === correctIndex"><CircleCheck /></el-icon>
              <el-icon v-else-if="selectedOption === idx"><CircleClose /></el-icon>
              <span v-else>{{ String.fromCharCode(65 + idx) }}</span>
            </template>
            <template v-else>
              <el-icon v-if="selectedOption === idx"><Check /></el-icon>
              <span v-else>{{ String.fromCharCode(65 + idx) }}</span>
            </template>
          </div>

          <div class="option-content" ref="optionRefs" v-html="option"></div>
        </div>
      </div>
    </div>

    <div class="card-action">
      <el-button
        type="primary"
        size="large"
        class="action-btn submit-btn"
        :disabled="selectedOption === null || hasSubmitted"
        @click="submitAnswer"
      >
        <el-icon class="el-icon--left"><Promotion /></el-icon>
        {{ hasSubmitted ? '已提交' : '提交答案' }}
      </el-button>

      <el-button
        size="large"
        class="action-btn toggle-btn"
        :plain="!showAnswer"
        @click="toggleAnswer"
      >
        <el-icon class="el-icon--left" v-if="!showAnswer"><VideoPlay /></el-icon>
        <el-icon class="el-icon--left" v-else><ArrowDown /></el-icon>
        {{ showAnswer ? '收起解析' : '查看解析' }}
      </el-button>
    </div>

    <el-collapse-transition>
      <div v-show="showAnswer" class="answer-wrapper">
        <div class="answer-box" ref="answerRef">
          <div class="answer-header">
            <span class="label">正确答案</span>
            <span class="key">{{ question.answer }}</span>
          </div>
          <el-divider class="inner-divider" />
          <div class="explanation">
            <h4>解析过程：</h4>
            <div class="exp-html" v-html="question.explanation"></div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<style scoped>
/* 样式保持不变 */
.card-container {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
  margin-bottom: 32px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.card-header { padding: 24px 32px 0; display: flex; justify-content: space-between; align-items: center; }
.header-main { display: flex; align-items: center; gap: 12px; }
.question-number { font-family: 'SF Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; }
.card-body { padding: 20px 32px 32px; }
.question-text { font-size: 1.1rem; line-height: 1.75; color: #1f2937; margin-bottom: 28px; font-weight: 500; }

.options-list { display: flex; flex-direction: column; gap: 12px; }
.option-item {
  display: flex; align-items: center; padding: 16px 20px;
  border: 2px solid #e5e7eb; border-radius: 12px;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
}
.option-item:hover:not(.is-disabled) { border-color: #c7d2fe; background-color: #f9fafb; }
.option-item.is-disabled { cursor: default; }

.option-item.is-selected { border-color: #4f46e5; background-color: #eef2ff; box-shadow: 0 0 0 1px #4f46e5; }
.option-item.is-selected .option-marker { background: #4f46e5; color: #fff; }

.option-item.is-correct-highlight { border-color: #10b981; background-color: #ecfdf5; box-shadow: 0 0 0 1px #10b981; }
.option-item.is-correct-highlight .option-marker { background-color: #10b981; color: #fff; }

.option-item.is-wrong-highlight { border-color: #ef4444; background-color: #fef2f2; box-shadow: 0 0 0 1px #ef4444; opacity: 0.8; }
.option-item.is-wrong-highlight .option-marker { background-color: #ef4444; color: #fff; }

.option-marker {
  width: 32px; height: 32px; border-radius: 50%;
  background: #f3f4f6; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  margin-right: 16px; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
  transition: all 0.2s;
}

.card-action { padding: 0 32px 32px; display: flex; gap: 16px; }
.action-btn { flex: 1; border-radius: 10px; font-weight: 600; height: 48px; font-size: 1rem; }
.toggle-btn { background: #f8fafc; border-color: #e2e8f0; color: #475569; }
.toggle-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #334155; }

.answer-wrapper { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px; }
.answer-header { display: flex; align-items: center; margin-bottom: 16px; }
.answer-header .label { font-size: 0.9rem; color: #64748b; margin-right: 12px; }
.answer-header .key { font-size: 1.5rem; font-weight: 800; color: #059669; }
.inner-divider { margin: 16px 0 24px; border-color: #e2e8f0; }
.explanation h4 { margin: 0 0 12px; font-size: 0.95rem; color: #1f2937; }
.exp-html { font-size: 0.95rem; line-height: 1.8; color: #4b5563; }

:deep(.katex) { font-size: 1.1em; }

@media (max-width: 768px) {
  .card-header { padding: 20px 20px 0; }
  .card-body { padding: 16px 20px 24px; }
  .card-action { padding: 0 20px 24px; flex-direction: column; }
}
</style>
