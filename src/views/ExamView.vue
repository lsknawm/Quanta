<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '../stores/exam'
import { ArrowLeft, ArrowRight, Loading, Refresh } from '@element-plus/icons-vue'

// 引入组件
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

// 初始化：组件挂载时，根据 URL 参数请求数据
onMounted(() => {
  const { subject, difficulty, count } = route.query

  if (!subject) {
    // 如果没有参数，踢回主页
    router.replace('/')
    return
  }

  // 调用 Store 的动作
  store.initExam({
    subject,
    difficulty: difficulty || 'B',
    count: Number(count) || 5
  })
})

// 处理用户作答：监听 value 变更并写入 Store
// 这里的逻辑有点巧妙：我们在 template 里直接用 v-model="store.userAnswers[id]"
// 这样就不用手写 update 函数了，Pinia 支持直接修改 State (虽然 action 更规范，但 v-model 最方便)

</script>

<template>
  <div class="exam-container">

    <div v-if="store.isLoading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在智能组卷，请稍候...</p>
    </div>

    <div v-else-if="store.error" class="error-state">
      <p>{{ store.error }}</p>
      <button class="retry-btn" @click="router.replace('/')">
        <el-icon><Refresh /></el-icon> 返回首页重试
      </button>
    </div>

    <div v-else-if="store.questions.length > 0" class="exam-content">

      <div class="progress-bar-wrapper">
        <div class="progress-fill" :style="{ width: store.progressPercentage + '%' }"></div>
      </div>

      <div class="exam-body">
        <div class="exam-header">
          <router-link to="/" class="exit-link">退出练习</router-link>
          <div class="counter">
            {{ store.currentIndex + 1 }} <span class="total">/ {{ store.questions.length }}</span>
          </div>
        </div>

        <div class="card-wrapper">
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
        </div>

        <div class="control-bar">
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
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>该科目下暂无符合条件的题目。</p>
      <router-link to="/">返回调整配置</router-link>
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

/* 状态展示 */
.loading-state, .error-state, .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748B;
  gap: 16px;
}
.loading-state .el-icon { font-size: 2rem; color: #3B82F6; }

.retry-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.retry-btn:hover { border-color: #3B82F6; color: #3B82F6; }

/* 进度条 */
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

/* 布局 */
.exam-content {
  flex: 1;
  display: flex;
  flex-direction: column;
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
.exit-link { text-decoration: none; color: inherit; font-size: 0.9rem; transition: color 0.2s; }
.exit-link:hover { color: #EF4444; }

.counter { font-weight: 700; color: #1E293B; font-size: 1.1rem; }
.total { color: #94A3B8; font-size: 0.9rem; font-weight: 400; }

.card-wrapper {
  flex: 1;
  /* 确保有足够的空间展示卡片 */
}

/* 底部按钮 */
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
  border: 1px solid #E2E8F0;
  background: #fff;
  color: #1E293B;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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
  transform: none;
}

/* 动画 */
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
