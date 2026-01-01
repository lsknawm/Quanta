<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import { VideoPlay, Promotion } from '@element-plus/icons-vue'

import TypeSingleChoice from './types/TypeSingleChoice.vue'
import TypeMultipleChoice from './types/TypeMultipleChoice.vue'
import TypeShortAnswer from './types/TypeShortAnswer.vue'

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true }
})

const userAnswer = ref(null)
const showAnswer = ref(false)
const hasSubmitted = ref(false)
const answerRef = ref(null)
const questionTextRef = ref(null)

// 新增：简答题的手动评分状态 (null=未评, true=对, false=错)
const manualCorrect = ref(null)

const componentMap = {
  'single_choice': TypeSingleChoice,
  'choice': TypeSingleChoice,
  'multiple_choice': TypeMultipleChoice,
  'short_answer': TypeShortAnswer
}

const initAnswer = () => {
  const type = props.question.type
  if (type === 'multiple_choice') userAnswer.value = []
  else if (type === 'short_answer') userAnswer.value = ''
  else userAnswer.value = null
}

const katexOptions = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false}
  ],
  throwOnError: false
}

const renderAllMath = () => {
  if (questionTextRef.value) renderMathInElement(questionTextRef.value, katexOptions)
}

watch(() => props.question, () => {
  hasSubmitted.value = false
  showAnswer.value = false
  manualCorrect.value = null // 重置手动评分
  initAnswer()
  nextTick(renderAllMath)
}, { immediate: true })

const correctData = computed(() => {
  if (!props.question.answer) return null
  const q = props.question
  if (q.type === 'single_choice' || q.type === 'choice') {
    return q.answer.charCodeAt(0) - 65
  }
  if (q.type === 'multiple_choice') {
    return q.answer.map(char => char.charCodeAt(0) - 65)
  }
  return q.answer
})

// 修改点：处理简答题逻辑 & 修复 sort 副作用
const isCorrect = computed(() => {
  if (!hasSubmitted.value) return false
  const type = props.question.type

  if (type === 'single_choice' || type === 'choice') {
    return userAnswer.value === correctData.value
  }

  if (type === 'multiple_choice') {
    // 修复：使用 [...arr] 避免原地 sort 修改
    const u = [...userAnswer.value].sort().join(',')
    const c = [...correctData.value].sort().join(',')
    return u === c
  }

  // 修改：简答题逻辑
  if (type === 'short_answer') {
    // 如果有手动评分，以手动评分为准
    if (manualCorrect.value !== null) return manualCorrect.value
    // 默认认为“未完成判定” (返回 false，但在 UI 上做特殊处理)
    return false
  }
  return false
})

// 新增：处理子组件传来的手动评分
const handleSelfMark = (status) => {
  manualCorrect.value = status
}

const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value
  if (showAnswer.value) await nextTick(() => { if (answerRef.value) renderMathInElement(answerRef.value, katexOptions) })
}

const submitAnswer = () => {
  if (props.question.type === 'short_answer' && !userAnswer.value) return
  if (props.question.type !== 'short_answer' && userAnswer.value === null) return
  if (Array.isArray(userAnswer.value) && userAnswer.value.length === 0) return

  hasSubmitted.value = true

  // 如果不是简答题，且答错了，自动展开解析
  if (props.question.type !== 'short_answer' && !isCorrect.value && !showAnswer.value) {
    toggleAnswer()
  }
  // 简答题提交后，自动展开解析供对比
  if (props.question.type === 'short_answer' && !showAnswer.value) {
    toggleAnswer()
  }
}

const getDiffColor = (diff) => ({ 'A': 'success', 'B': 'info', 'C': 'warning', 'D': 'danger' }[diff] || 'info')

// 新增：计算顶部 Tag 的状态
const statusTag = computed(() => {
  if (!hasSubmitted.value) return null

  if (props.question.type === 'short_answer') {
    if (manualCorrect.value === true) return { type: 'success', text: '回答正确' }
    if (manualCorrect.value === false) return { type: 'danger', text: '回答错误' }
    return { type: 'warning', text: '待自评' }
  }

  return isCorrect.value
    ? { type: 'success', text: '回答正确' }
    : { type: 'danger', text: '回答错误' }
})
</script>

<template>
  <div class="card-container">
    <div class="card-header">
      <div class="header-main">
        <span class="question-number">Question {{ index + 1 }}</span>
        <el-tag :type="getDiffColor(question.difficulty)" size="small" effect="plain" round class="diff-tag">
          {{ question.category }} · {{ question.type === 'multiple_choice' ? '多选题' : (question.type === 'short_answer' ? '简答题' : '单选题') }}
        </el-tag>
      </div>

      <transition name="el-fade-in">
        <el-tag v-if="hasSubmitted" :type="statusTag.type" effect="dark" round>
          {{ statusTag.text }}
        </el-tag>
      </transition>
    </div>

    <div class="card-body">
      <div class="question-text" ref="questionTextRef" v-html="question.content"></div>
      <div v-if="question.content_image" class="image-wrapper">
        <img :src="question.content_image" class="generated-image" />
      </div>

      <component
        :is="componentMap[question.type]"
        :question="question"
        v-model="userAnswer"
        :isSubmitted="hasSubmitted"
        :correctIndex="correctData"
        :correctIndices="correctData"
        :correctAnswer="question.answer"
        :selfCorrectStatus="manualCorrect"
        @toggle-correct="handleSelfMark"
      />
    </div>

    <div class="card-action">
      <el-button type="primary" size="large" class="action-btn" :disabled="hasSubmitted" @click="submitAnswer">
        <el-icon class="el-icon--left"><Promotion /></el-icon> {{ hasSubmitted ? '已提交' : '提交答案' }}
      </el-button>
      <el-button size="large" class="action-btn toggle-btn" :plain="!showAnswer" @click="toggleAnswer">
        <el-icon class="el-icon--left"><VideoPlay /></el-icon> {{ showAnswer ? '收起解析' : '查看解析' }}
      </el-button>
    </div>

    <el-collapse-transition>
      <div v-show="showAnswer" class="answer-wrapper">
        <div class="answer-box" ref="answerRef">
          <div class="answer-header">
            <span class="label">参考答案</span>
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
/* 样式与之前保持一致 */
.card-container { background: #fff; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 32px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.card-header { padding: 24px 32px 0; display: flex; justify-content: space-between; align-items: center; }
.question-number { font-family: 'SF Mono', monospace; font-size: 0.85rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; margin-right: 12px; }
.card-body { padding: 20px 32px 32px; }
.question-text { font-size: 1.1rem; line-height: 1.75; color: #1f2937; margin-bottom: 16px; font-weight: 500; }
.image-wrapper { margin-bottom: 24px; border: 1px solid #e5e7eb; padding: 12px; display: inline-block; border-radius: 8px; }
.generated-image { max-width: 100%; max-height: 300px; }
.card-action { padding: 0 32px 32px; display: flex; gap: 16px; }
.action-btn { flex: 1; border-radius: 10px; font-weight: 600; height: 48px; }
.toggle-btn { background: #f8fafc; border-color: #e2e8f0; color: #475569; }
.answer-wrapper { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px; }
.answer-header .label { font-size: 0.9rem; color: #64748b; margin-right: 12px; }
.answer-header .key { font-size: 1.5rem; font-weight: 800; color: #059669; }
.inner-divider { margin: 16px 0 24px; border-color: #e2e8f0; }
.exp-html { font-size: 0.95rem; line-height: 1.8; color: #4b5563; }
:deep(.katex) { font-size: 1.1em; }
</style>
