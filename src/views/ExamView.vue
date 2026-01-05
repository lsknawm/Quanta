<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '../stores/exam'
import { ArrowLeft, ArrowRight, Loading, Refresh } from '@element-plus/icons-vue'

// 引入容器和题型组件
import QuestionCard from '../components/QuestionCard.vue'
import SingleChoice from '../components/questions/SingleChoice.vue'
import MultipleChoice from '../components/questions/MultipleChoice.vue'
import TrueFalse from '../components/questions/TrueFalse.vue'
import ShortAnswer from '../components/questions/ShortAnswer.vue'
import FillBlank from '../components/questions/FillBlank.vue'

const route = useRoute()
const router = useRouter()
const store = useExamStore()

// 映射题型到组件
const componentMap = {
  'single_choice': SingleChoice,
  'multiple_choice': MultipleChoice,
  'true_false': TrueFalse,
  'short_answer': ShortAnswer,
  'fill_blank': FillBlank
}

// 初始化
onMounted(() => {
  const { subject, difficulty, count } = route.query

  if (!subject) {
    router.replace('/')
    return
  }

  store.initExam({
    subject,
    difficulty: difficulty || 'B',
    count: Number(count) || 5
  })
})
</script>

<template>
  <div class="exam-view">

    <div v-if="store.isLoading" class="state-container loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在智能组卷...</p>
    </div>

    <div v-else-if="store.error" class="state-container error">
      <p>{{ store.error }}</p>
      <button class="retry-btn" @click="router.replace('/')">
        <el-icon><Refresh /></el-icon> 返回首页重试
      </button>
    </div>

    <div v-else-if="store.questions.length > 0" class="exam-layout">

      <div class="progress-track">
        <div class="progress-bar" :style="{ width: store.progressPercentage + '%' }"></div>
      </div>

      <div class="exam-content">
        <header class="exam-header">
          <router-link to="/" class="exit-btn">退出练习</router-link>
          <div class="counter">
            <span class="current">{{ store.currentIndex + 1 }}</span>
            <span class="divider">/</span>
            <span class="total">{{ store.questions.length }}</span>
          </div>
        </header>

        <main class="card-area">
          <transition name="slide-fade" mode="out-in">
            <QuestionCard
              :key="store.currentQuestion.id"
              :index="store.currentIndex"
              :meta="store.currentQuestion.meta"
            >
              <component
                :is="componentMap[store.currentQuestion.type]"
                :question="store.currentQuestion"
                v-model="store.userAnswers[store.currentQuestion.id]"
              />
            </QuestionCard>
          </transition>
        </main>

        <footer class="control-bar">
          <button
            class="nav-btn prev"
            :disabled="store.isFirstQuestion"
            @click="store.prevQuestion"
          >
            <el-icon><ArrowLeft /></el-icon> 上一题
          </button>

          <button
            class="nav-btn next"
            :disabled="store.isLastQuestion"
            @click="store.nextQuestion"
          >
            下一题 <el-icon><ArrowRight /></el-icon>
          </button>
        </footer>
      </div>
    </div>

    <div v-else class="state-container empty">
      <p>暂无题目</p>
      <router-link to="/">返回配置</router-link>
    </div>

  </div>
</template>

<style scoped>
.exam-view {
  min-height: calc(100vh - 64px); /* 减去NavBar高度 */
  background-color: var(--bg-page);
  display: flex;
  flex-direction: column;
}

/* 状态容器 (Loading/Error/Empty) */
.state-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
}
.state-container .el-icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.retry-btn {
  padding: 10px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  transition: all 0.2s;
}
.retry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 进度条 */
.progress-track {
  height: 4px;
  background: var(--border-color);
  width: 100%;
}
.progress-bar {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

/* 布局结构 */
.exam-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.exam-content {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.exit-btn {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
.exit-btn:hover { color: var(--color-danger); }

.counter {
  font-family: 'Monaco', monospace;
  font-weight: 700;
  font-size: 1.1rem;
}
.counter .current { color: var(--text-main); }
.counter .divider { margin: 0 4px; color: var(--text-placeholder); }
.counter .total { color: var(--text-secondary); }

.card-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 控制栏 */
.control-bar {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}
.nav-btn:hover:not(:disabled) {
  background: var(--bg-surface-alt);
  transform: translateY(-1px);
}
.nav-btn.next {
  background: var(--text-main); /* 使用深色作为主按钮 */
  color: white;
  border-color: var(--text-main);
}
.nav-btn.next:hover:not(:disabled) {
  background: black;
}
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
