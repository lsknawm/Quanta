<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import { VideoPlay, Promotion } from '@element-plus/icons-vue'

// QuestionCard.vue 中的这段代码现在是正确的，只要文件位置对上就行
import TypeSingleChoice from './types/TypeSingleChoice.vue'
import TypeMultipleChoice from './types/TypeMultipleChoice.vue'
import TypeShortAnswer from './types/TypeShortAnswer.vue'

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true }
})

// 状态管理
const userAnswer = ref(null) // 可能是数字(单选)，数组(多选)，字符串(简答)
const showAnswer = ref(false)
const hasSubmitted = ref(false)
const answerRef = ref(null)
const questionTextRef = ref(null)

// 动态组件映射
const componentMap = {
  'single_choice': TypeSingleChoice,
  'choice': TypeSingleChoice, // 兼容旧数据
  'multiple_choice': TypeMultipleChoice,
  'short_answer': TypeShortAnswer
}

// 初始化用户答案的默认值
const initAnswer = () => {
  const type = props.question.type
  if (type === 'multiple_choice') userAnswer.value = []
  else if (type === 'short_answer') userAnswer.value = ''
  else userAnswer.value = null // single_choice
}

// 监听题目变化，重置状态
watch(() => props.question, () => {
  hasSubmitted.value = false
  showAnswer.value = false
  initAnswer()
  nextTick(renderAllMath)
}, { immediate: true })

// 答案解析
const correctData = computed(() => {
  if (!props.question.answer) return null
  const q = props.question

  if (q.type === 'single_choice' || q.type === 'choice') {
    return q.answer.charCodeAt(0) - 65
  }
  if (q.type === 'multiple_choice') {
    // 将 ["A", "B"] 转为 [0, 1]
    return q.answer.map(char => char.charCodeAt(0) - 65)
  }
  return q.answer // 简答题直接返回字符串
})

// 判断正误逻辑
const isCorrect = computed(() => {
  if (!hasSubmitted.value) return false
  const type = props.question.type

  if (type === 'single_choice' || type === 'choice') {
    return userAnswer.value === correctData.value
  }
  if (type === 'multiple_choice') {
    // 数组比较：长度相等且内容一致
    const u = userAnswer.value.sort().join(',')
    const c = correctData.value.sort().join(',')
    return u === c
  }
  if (type === 'short_answer') {
    // 简答题简单的字符串比对，忽略前后空格
    return userAnswer.value.trim() === correctData.value.trim()
  }
  return false
})

// KaTeX 渲染
const katexOptions = { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}], throwOnError: false }
const renderAllMath = () => {
  if (questionTextRef.value) renderMathInElement(questionTextRef.value, katexOptions)
  // 子组件内部的渲染由子组件或 nextTick 处理，这里主要处理题干
}
const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value
  if (showAnswer.value) await nextTick(() => { if (answerRef.value) renderMathInElement(answerRef.value, katexOptions) })
}

const submitAnswer = () => {
  // 简答题允许空提交？还是做个非空校验？这里做个简单的
  if (props.question.type === 'short_answer' && !userAnswer.value) return
  if (props.question.type !== 'short_answer' && userAnswer.value === null) return
  if (Array.isArray(userAnswer.value) && userAnswer.value.length === 0) return

  hasSubmitted.value = true
  if (!isCorrect.value && !showAnswer.value) toggleAnswer()
}

const getDiffColor = (diff) => ({ 'A': 'success', 'B': 'info', 'C': 'warning', 'D': 'danger' }[diff] || 'info')
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
        <el-tag v-if="hasSubmitted" :type="isCorrect ? 'success' : 'danger'" effect="dark" round>
          {{ isCorrect ? '回答正确' : (question.type === 'short_answer' ? '请核对解析' : '回答错误') }}
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
/* 这里保留之前的 Card 样式即可 */
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
