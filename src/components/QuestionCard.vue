<script setup>
import { ref, onMounted, nextTick } from 'vue'
import katex from 'katex'
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import { VideoPlay, ArrowDown, Check } from '@element-plus/icons-vue' // 引入需要的图标

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true }
})

const selectedOption = ref(null)
const showAnswer = ref(false)
const contentRef = ref(null)
const answerRef = ref(null)

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
  renderArea(contentRef.value)
})

const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value
  if (showAnswer.value) {
    await nextTick()
    renderArea(answerRef.value)
  }
}

// 难度标签颜色
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
    </div>

    <div class="card-body" ref="contentRef">
      <div class="question-text" v-html="question.content"></div>

      <div class="options-list" v-if="question.type === 'choice'">
        <div
          v-for="(option, idx) in question.options"
          :key="idx"
          class="option-item"
          :class="{ 'is-selected': selectedOption === idx }"
          @click="selectedOption = idx"
        >
          <div class="option-marker">
            <span v-if="selectedOption !== idx">{{ String.fromCharCode(65 + idx) }}</span>
            <el-icon v-else><Check /></el-icon>
          </div>
          <div class="option-content" v-html="option"></div>
        </div>
      </div>
    </div>

    <div class="card-action">
      <el-button
        type="primary"
        size="large"
        class="action-btn"
        :plain="showAnswer"
        @click="toggleAnswer"
      >
        <el-icon class="el-icon--left" v-if="!showAnswer"><VideoPlay /></el-icon>
        <el-icon class="el-icon--left" v-else><ArrowDown /></el-icon>
        {{ showAnswer ? '收起解析' : '查看答案 & 解析' }}
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
/* 卡片主体 */
.card-container {
  background: #fff;
  border-radius: 16px; /* 更大的圆角 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); /* Tailwind 风格阴影 */
  border: 1px solid #f3f4f6; /* 极淡的边框 */
  margin-bottom: 32px;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card-container:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  /*Q transform: translateY(-2px); 可选：去掉位移让它稳重一点，或者保留 */
}

/* 头部 */
.card-header {
  padding: 24px 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-number {
  font-family: 'SF Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.diff-tag {
  font-weight: 600;
}

/* 内容区 */
.card-body {
  padding: 20px 32px 32px;
}

.question-text {
  font-size: 1.1rem;
  line-height: 1.75;
  color: #1f2937;
  margin-bottom: 28px;
  font-weight: 500;
}

/* 选项列表 */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: 2px solid #e5e7eb; /* 默认灰色边框 */
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
}

.option-item:hover {
  border-color: #c7d2fe; /* 悬停时浅紫/蓝 */
  background-color: #f9fafb;
}

/* 选中状态 */
.option-item.is-selected {
  border-color: #4f46e5; /* 品牌主色 */
  background-color: #eef2ff; /* 极浅的品牌色背景 */
  box-shadow: 0 0 0 1px #4f46e5; /* 双重边框强化视觉 */
}

.option-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.option-item.is-selected .option-marker {
  background: #4f46e5;
  color: #fff;
}

.option-content {
  color: #374151;
  font-size: 1rem;
}

/* 底部操作区 */
.card-action {
  padding: 0 32px 32px;
}

.action-btn {
  width: 100%;
  border-radius: 10px;
  font-weight: 600;
  height: 48px;
  font-size: 1rem;
}

/* 答案解析区 */
.answer-wrapper {
  background-color: #f8fafc; /* 浅蓝灰色背景 */
  border-top: 1px solid #e2e8f0;
  padding: 32px;
}

.answer-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.answer-header .label {
  font-size: 0.9rem;
  color: #64748b;
  margin-right: 12px;
}

.answer-header .key {
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669; /* 绿色 */
}

.inner-divider {
  margin: 16px 0 24px;
  border-color: #e2e8f0;
}

.explanation h4 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: #1f2937;
}

.exp-html {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #4b5563;
}

:deep(.katex) {
  font-size: 1.1em;
}
</style>
