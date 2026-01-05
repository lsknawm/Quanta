<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// 引入所有题型组件
import QuestionCard from '../components/QuestionCard.vue'
import SingleChoice from '../components/questions/SingleChoice.vue'
import MultipleChoice from '../components/questions/MultipleChoice.vue'
import TrueFalse from '../components/questions/TrueFalse.vue'
import ShortAnswer from '../components/questions/ShortAnswer.vue' // 新增
import FillBlank from '../components/questions/FillBlank.vue'     // 新增

// --- 静态测试数据 (包含5种题型) ---
const questions = ref([
  {
    id: "Q1",
    type: "single_choice",
    meta: { difficulty: "A", score: 2, type: "single_choice" },
    content: { text: "Vue 3 中使用哪个函数定义响应式对象？" },
    structure: {
      options: [
        { id: "OPT_A", text: "ref()" },
        { id: "OPT_B", text: "react()" },
        { id: "OPT_C", text: "vue()" }
      ]
    }
  },
  {
    id: "Q2",
    type: "multiple_choice",
    meta: { difficulty: "B", score: 5, type: "multiple_choice" },
    content: { text: "以下哪些是 Vue 的生命周期钩子？(多选)" },
    structure: {
      options: [
        { id: "OPT_A", text: "onMounted" },
        { id: "OPT_B", text: "onUpdated" },
        { id: "OPT_C", text: "componentDidMount" },
        { id: "OPT_D", text: "onUnmounted" }
      ]
    }
  },
  {
    id: "Q3",
    type: "true_false",
    meta: { difficulty: "A", score: 2, type: "true_false" },
    content: { text: "Vue 的 v-if 和 v-show 作用完全相同。" },
    structure: {}
  },
  // --- 新增简答题测试 ---
  {
    id: "Q4",
    type: "short_answer",
    meta: { difficulty: "C", score: 10, type: "short_answer" },
    content: { text: "请简述 Vue 3 Composition API 相比 Options API 的主要优势。" },
    structure: {}
  },
  // --- 新增填空题测试 ---
  {
    id: "Q5",
    type: "fill_blank",
    meta: { difficulty: "B", score: 4, type: "fill_blank" },
    content: { text: "Vue 中用于监听数据变化的侦听器 API 是 _____。" },
    structure: {}
  }
])

// --- 状态管理 ---
const currentIndex = ref(0)
const answers = ref({}) // key: questionId, value: answer (string | array)

// 计算属性
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercentage = computed(() => ((currentIndex.value + 1) / questions.value.length) * 100)

// --- 动态组件映射表 ---
const componentMap = {
  'single_choice': SingleChoice,
  'multiple_choice': MultipleChoice,
  'true_false': TrueFalse,
  'short_answer': ShortAnswer, // 注册
  'fill_blank': FillBlank      // 注册
}

// --- 动作 ---
const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
</script>

<template>
  <div class="exam-container">

    <div class="progress-bar-wrapper">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <div class="exam-body">
      <div class="exam-header">
        <router-link to="/" class="back-link">退出练习</router-link>
        <div class="counter">
          {{ currentIndex + 1 }} <span class="total">/ {{ questions.length }}</span>
        </div>
      </div>

      <div class="card-wrapper">
        <transition name="slide-fade" mode="out-in">

          <QuestionCard
            :key="currentQuestion.id"
            :index="currentIndex"
            :meta="currentQuestion.meta"
          >
            <component
              :is="componentMap[currentQuestion.type]"
              :question="currentQuestion"
              v-model="answers[currentQuestion.id]"
            />
          </QuestionCard>

        </transition>
      </div>

      <div class="control-bar">
        <button
          class="nav-btn prev"
          :disabled="currentIndex === 0"
          @click="prevQuestion"
        >
          <el-icon><ArrowLeft /></el-icon> 上一题
        </button>

        <span class="debug-ans">
          Ans: {{ typeof answers[currentQuestion.id] === 'object'
          ? JSON.stringify(answers[currentQuestion.id])
          : (answers[currentQuestion.id] || '未作答')
          }}
        </span>

        <button
          class="nav-btn next"
          :disabled="currentIndex === questions.length - 1"
          @click="nextQuestion"
        >
          下一题 <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-container {
  min-height: 100vh;
  background: #F8FAFC;
  display: flex;
  flex-direction: column;
}

.progress-bar-wrapper {
  height: 4px;
  background: #E2E8F0;
  width: 100%;
}
.progress-fill {
  height: 100%;
  background: #3B82F6;
  transition: width 0.3s ease;
}

.exam-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #64748B;
}
.back-link { text-decoration: none; color: inherit; font-size: 0.9rem; }
.counter { font-weight: 700; color: #1E293B; font-size: 1.1rem; }
.total { color: #94A3B8; font-size: 0.9rem; font-weight: 400; }

.card-wrapper {
  flex: 1;
}

.control-bar {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: #fff;
  color: #1E293B;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
}
.nav-btn:hover:not(:disabled) {
  background: #F1F5F9;
  transform: translateY(-1px);
}
.nav-btn.next {
  background: #18181B;
  color: white;
  border-color: #18181B;
}
.nav-btn.next:hover:not(:disabled) {
  background: #27272A;
}
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.debug-ans {
  font-size: 0.8rem;
  color: #94A3B8;
  font-family: monospace;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
