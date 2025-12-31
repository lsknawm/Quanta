<script setup>
import { ref, computed } from 'vue'
import QuestionCard from './components/QuestionCard.vue'
import {
  ArrowLeft,
  ArrowRight,
  UploadFilled,
  Monitor,
  Collection
} from '@element-plus/icons-vue'

// --- 现有逻辑 (保持不变) ---
const questions = ref([
  {
    id: 101,
    type: 'choice',
    category: '高等数学',
    difficulty: 'C',
    content: String.raw`求极限 $\lim_{x \to 0} \frac{\int_0^x (e^{t^2} - 1) dt}{x^3}$ 的值。`,
    options: [String.raw`$1$`, String.raw`$\frac{1}{2}$`, String.raw`$\frac{1}{3}$`, String.raw`$0$`],
    answer: 'C',
    explanation: String.raw`本题考察洛必达法则...`
  },
  {
    id: 201,
    type: 'choice',
    category: '线性代数',
    difficulty: 'D',
    content: String.raw`设 $A$ 为 3 阶矩阵，其特征值为 $1, -1, 2$，则 $|A^* + 3E| = ?$`,
    options: ['$24$', '$30$', '$32$', '$48$'],
    answer: 'A',
    explanation: String.raw`利用伴随矩阵性质...`
  }
])

const currentIndex = ref(0)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercentage = computed(() => ((currentIndex.value + 1) / questions.value.length) * 100)

const nextQuestion = () => { if (currentIndex.value < questions.value.length - 1) currentIndex.value++ }
const prevQuestion = () => { if (currentIndex.value > 0) currentIndex.value-- }

// --- 新增：上传相关逻辑 ---
const uploadVisible = ref(false)
const activeTab = ref('题库') // 用于控制顶部 Tab 激活状态

const handleUploadOpen = () => {
  activeTab.value = '上传' // 视觉上激活
  uploadVisible.value = true
}

const handleDialogClose = () => {
  activeTab.value = '题库' // 关闭后切回默认
  uploadVisible.value = false
}
</script>

<template>
  <el-config-provider size="default">
    <div class="app-wrapper">

      <header class="app-header">
        <div class="container">
          <div class="header-left">
            <div class="logo">
              <div class="logo-icon">Q</div>
              <span class="logo-text">Quanta</span>
            </div>

            <nav class="main-nav">
              <div
                class="nav-item"
                :class="{ active: activeTab === '题库' }"
                @click="activeTab = '题库'"
              >
                <el-icon><Collection /></el-icon>
                <span>刷题</span>
              </div>
              <div
                class="nav-item"
                :class="{ active: activeTab === '上传' }"
                @click="handleUploadOpen"
              >
                <el-icon><UploadFilled /></el-icon>
                <span>上传题目</span>
              </div>
            </nav>
          </div>

          <div class="header-right">
            <div class="progress-wrapper">
              <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
              <div class="progress-bg">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>
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
            <el-button @click="prevQuestion" :disabled="currentIndex === 0" size="large" circle class="nav-btn">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <span class="nav-indicator">{{ currentIndex + 1 }} <span class="divider">/</span> {{ questions.length }}</span>
            <el-button @click="nextQuestion" :disabled="currentIndex === questions.length - 1" type="primary" size="large" circle class="nav-btn next-btn">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </main>

      <el-dialog
        v-model="uploadVisible"
        title="导入题目"
        width="500px"
        align-center
        class="upload-dialog"
        :before-close="handleDialogClose"
      >
        <div class="upload-content">
          <p class="upload-tip">支持上传 Excel 题库或直接截图上传 (AI 自动识别)</p>

          <el-upload
            class="upload-dragger-custom"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处 或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .xlsx, .jpg, .png 文件，单个文件不超过 5MB
              </div>
            </template>
          </el-upload>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleDialogClose">取消</el-button>
            <el-button type="primary" @click="handleDialogClose">开始解析</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </el-config-provider>
</template>

<style scoped>
/* 全局容器 */
.app-wrapper {
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.container.narrow { max-width: 720px; }

/* --- 1. Header 样式升级 --- */
.app-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
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

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.2rem;
  color: #111827;
  cursor: pointer;
}

.logo-icon {
  background: #4f46e5;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.2);
}

/* 导航 Tab */
.main-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background-color: #eef2ff;
  color: #4f46e5;
}

/* 简化版进度条 */
.header-right {
  display: flex;
  align-items: center;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 0.85rem;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', monospace;
}

.progress-bg {
  width: 100px;
  height: 6px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  border-radius: 99px;
  transition: width 0.3s ease;
}

/* --- 2. 主内容区 (保持) --- */
.main-content { padding: 40px 0; flex: 1; }
.question-wrapper { min-height: 400px; }
.navigation-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding: 0 16px; }
.nav-indicator { font-family: 'SF Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #1f2937; }
.divider { color: #d1d5db; margin: 0 8px; font-weight: 400; }
.nav-btn { width: 56px !important; height: 56px !important; font-size: 1.2rem !important; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: all 0.2s; }
.next-btn { background: #4f46e5; border-color: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }

/* --- 3. Upload Dialog 样式定制 --- */
/* 这里的 :global 是为了覆盖 Element Plus 内部样式，或者你可以去掉 scoped */
:deep(.upload-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 1.1rem;
}

.upload-content {
  padding: 10px 0;
}

.upload-tip {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 0.9rem;
}

/* 自定义上传区域样式 */
:deep(.el-upload-dragger) {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 40px 0;
  transition: all 0.2s;
  background-color: #f9fafb;
}

:deep(.el-upload-dragger:hover) {
  border-color: #4f46e5;
  background-color: #eef2ff;
}

:deep(.el-icon--upload) {
  color: #9ca3af;
  font-size: 48px;
  margin-bottom: 16px;
}

:deep(.el-upload__text) {
  color: #4b5563;
  font-size: 0.95rem;
}

:deep(.el-upload__text em) {
  color: #4f46e5;
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-left { gap: 16px; }
  .logo-text { display: none; } /* 手机端隐藏 Logo 文字 */
  .nav-item span { display: none; } /* 手机端只显示图标 */
  .nav-item { padding: 8px; }
  .progress-wrapper { display: none; } /* 手机端隐藏顶部进度条，节省空间 */

  :deep(.upload-dialog) {
    width: 90% !important;
  }
}
</style>
