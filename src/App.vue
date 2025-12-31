<script setup>
import { ref, computed } from 'vue'
import QuestionCard from './components/QuestionCard.vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// 题目数据 (保持不变)
const questions = ref([
  {
    id: 101,
    type: 'choice',
    category: '高等数学',
    difficulty: 'C',
    content: String.raw`求极限 $\lim_{x \to 0} \frac{\int_0^x (e^{t^2} - 1) dt}{x^3}$ 的值。`,
    options: [
      String.raw`$1$`,
      String.raw`$\frac{1}{2}$`,
      String.raw`$\frac{1}{3}$`,
      String.raw`$0$`
    ],
    answer: 'C',
    explanation: String.raw`
      本题考察洛必达法则与变上限积分求导。<br>
      令 $f(x) = \int_0^x (e^{t^2} - 1) dt$，$g(x) = x^3$。<br>
      当 $x \to 0$ 时，分子分母均为 $0$，属于 $\frac{0}{0}$ 型，使用洛必达法则：<br>
      $$ \lim_{x \to 0} \frac{f'(x)}{g'(x)} = \lim_{x \to 0} \frac{e^{x^2} - 1}{3x^2} $$<br>
      再次使用等价无穷小代换，当 $x \to 0$ 时，$e^{x^2} - 1 \sim x^2$。<br>
      $$ = \lim_{x \to 0} \frac{x^2}{3x^2} = \frac{1}{3} $$
    `
  },
  {
    id: 201,
    type: 'choice',
    category: '线性代数',
    difficulty: 'D',
    content: String.raw`设 $A$ 为 3 阶矩阵，其特征值为 $1, -1, 2$，则 $|A^* + 3E| = ?$`,
    options: [
      '$24$',
      '$30$',
      '$32$',
      '$48$'
    ],
    answer: 'A',
    explanation: String.raw`
      利用伴随矩阵性质与特征值关系求解...
    `
  },
  {
    id: 40801,
    type: 'choice',
    category: '408 数据结构',
    difficulty: 'C',
    content: String.raw`若度为 $m$ 的哈夫曼树中，其叶结点个数为 $n$，则非叶结点的个数为？`,
    options: [
      '$n-1$',
      String.raw`$\lfloor \frac{n-1}{m-1} \rfloor$`,
      String.raw`$\lceil \frac{n-1}{m-1} \rceil$`,
      String.raw`$\frac{n-1}{m-1}$`
    ],
    answer: 'C',
    explanation: String.raw`
      公式推导：$n_0 = (m-1)n_k + 1$...
    `
  }
])

// --- 新增逻辑 ---
const currentIndex = ref(0)

// 当前显示的题目
const currentQuestion = computed(() => questions.value[currentIndex.value])

// 进度百分比
const progressPercentage = computed(() => {
  return ((currentIndex.value + 1) / questions.value.length) * 100
})

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>

<template>
  <el-config-provider size="default">
    <div class="app-wrapper">
      <header class="app-header">
        <div class="container">
          <div class="logo">
            <span class="logo-icon">Q</span>
            <span class="logo-text">Quanta</span>
          </div>
          <div class="header-progress">
            <span class="progress-text">Progress {{ currentIndex + 1 }} / {{ questions.length }}</span>
            <el-progress
              :percentage="progressPercentage"
              :show-text="false"
              :stroke-width="6"
              color="#4f46e5"
              class="progress-bar"
            />
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container narrow">

          <div class="question-wrapper">
            <QuestionCard
              :key="currentQuestion.id"
              :question="currentQuestion"
              :index="currentIndex"
            />
          </div>

          <div class="navigation-bar">
            <el-button
              @click="prevQuestion"
              :disabled="currentIndex === 0"
              size="large"
              class="nav-btn"
              circle
            >
              <el-icon><ArrowLeft /></el-icon>
            </el-button>

            <span class="nav-indicator">
              {{ currentIndex + 1 }} <span class="divider">/</span> {{ questions.length }}
            </span>

            <el-button
              @click="nextQuestion"
              :disabled="currentIndex === questions.length - 1"
              type="primary"
              size="large"
              class="nav-btn next-btn"
              circle
            >
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>

        </div>
      </main>

      <footer class="app-footer">
        <p>© 2025 Quanta Inc. Keep coding.</p>
      </footer>
    </div>
  </el-config-provider>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1f2937;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.container.narrow {
  max-width: 720px; /* 进一步收窄，聚焦单题体验 */
}

/* Header */
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
}

.app-header .container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.25rem;
  color: #111827;
}

.logo-icon {
  background: #4f46e5;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.header-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 200px;
}

.progress-text {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-bar {
  width: 100%;
}

/* Main */
.main-content {
  padding: 40px 0;
  flex: 1; /* 让内容区撑开，footer 沉底 */
}

.question-wrapper {
  min-height: 400px; /* 防止切换题目时页面高度跳动 */
}

/* 底部导航条 */
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 0 16px;
}

.nav-indicator {
  font-family: 'SF Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.nav-indicator .divider {
  color: #d1d5db;
  margin: 0 8px;
  font-weight: 400;
}

.nav-btn {
  width: 56px !important;
  height: 56px !important;
  font-size: 1.2rem !important;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.next-btn {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.next-btn:hover:not(:disabled) {
  background: #4338ca;
  border-color: #4338ca;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.4);
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 32px 0;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
</style>
