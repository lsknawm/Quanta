<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import {
  ArrowRight,
  Search,
  Trophy,
  Zap,
  Cpu
} from '@element-plus/icons-vue'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 状态 ---
const form = ref({
  subject: '',
  difficulty: 'B', // 默认 B
  limit: 10
})

// --- 选项配置 ---
const difficulties = [
  { value: 'A', label: 'Basic', desc: '基础概念' },
  { value: 'B', label: 'Advanced', desc: '进阶应用' },
  { value: 'C', label: 'Expert', desc: '复杂场景' },
  { value: 'D', label: 'Master', desc: '极高难度' }
]

const limitPresets = [5, 10, 20, 50]

// --- 生命周期 ---
onMounted(() => {
  subjectStore.initData()
})

// --- 交互逻辑 ---
const handleStartQuiz = () => {
  if (!form.value.subject) return

  router.push({
    path: '/exam',
    query: {
      subject: form.value.subject,
      difficulty: form.value.difficulty,
      count: form.value.limit
    }
  })
}

// 简单的搜索过滤（如果科目很多）
const searchQuery = ref('')
const filteredSubjects = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return subjectStore.subjects.filter(s => s.toLowerCase().includes(q))
})

const selectSubject = (sub) => {
  form.value.subject = sub
}
</script>

<template>
  <div class="saas-container">
    <div class="content-wrapper">

      <header class="page-header">
        <div class="header-badge">Quanta Quiz Engine</div>
        <h1 class="title">Create your assessment</h1>
        <p class="subtitle">配置参数以生成定制化的专项练习试卷。</p>
      </header>

      <div class="bento-grid">

        <div class="bento-card subject-card">
          <div class="card-header">
            <h3>Select Subject</h3>
            <div class="search-input-wrapper">
              <el-icon><Search /></el-icon>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search topics..."
                class="bare-input"
              >
            </div>
          </div>

          <div class="subject-list custom-scrollbar">
            <div
              v-for="sub in filteredSubjects"
              :key="sub"
              class="subject-item"
              :class="{ active: form.subject === sub }"
              @click="selectSubject(sub)"
            >
              <div class="subject-icon">
                <el-icon><Cpu /></el-icon>
              </div>
              <span class="subject-name">{{ sub }}</span>
              <div class="check-mark" v-if="form.subject === sub">
                <div class="dot"></div>
              </div>
            </div>

            <div v-if="filteredSubjects.length === 0" class="empty-state">
              No subjects found.
            </div>
          </div>
        </div>

        <div class="grid-column">

          <div class="bento-card config-card">
            <div class="card-header">
              <h3>Difficulty</h3>
              <span class="value-tag">{{ form.difficulty }}</span>
            </div>
            <div class="segmented-control">
              <button
                v-for="diff in difficulties"
                :key="diff.value"
                class="segment-btn"
                :class="{ active: form.difficulty === diff.value }"
                @click="form.difficulty = diff.value"
              >
                <span class="seg-label">{{ diff.label }}</span>
                <span class="seg-desc">{{ diff.desc }}</span>
              </button>
            </div>
          </div>

          <div class="bento-card config-card">
            <div class="card-header">
              <h3>Question Limit</h3>
              <span class="value-tag">{{ form.limit }} Qs</span>
            </div>
            <div class="limit-selector">
              <div class="limit-presets">
                <button
                  v-for="num in limitPresets"
                  :key="num"
                  class="preset-btn"
                  :class="{ active: form.limit === num }"
                  @click="form.limit = num"
                >
                  {{ num }}
                </button>
              </div>
              <div class="custom-limit">
                <input
                  v-model.number="form.limit"
                  type="number"
                  min="1"
                  max="50"
                  class="limit-input"
                >
              </div>
            </div>
          </div>

          <button
            class="start-button"
            :disabled="!form.subject"
            @click="handleStartQuiz"
          >
            <span class="btn-text">Generate Quiz</span>
            <el-icon><ArrowRight /></el-icon>
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- Modern SaaS Design Tokens --- */
:root {
  --bg-app: #FAFAFA;       /* 极浅的灰白背景 */
  --bg-card: #FFFFFF;
  --text-primary: #18181B; /* Zinc 900 */
  --text-secondary: #71717A; /* Zinc 500 */
  --text-tertiary: #A1A1AA;
  --border-subtle: #E4E4E7; /* Zinc 200 */
  --border-hover: #D4D4D8;
  --primary-brand: #000000; /* Vercel style Black */
  --primary-hover: #27272A;
  --accent-blue: #3B82F6;
  --radius-xl: 24px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.saas-container {
  min-height: calc(100vh - 64px); /* 减去导航栏高度 */
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1000px;
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- Header --- */
.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.header-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #F4F4F5;
  border: 1px solid #E4E4E7;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 12px 0;
  background: linear-gradient(to bottom, #000, #444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* --- Bento Grid Layout --- */
.bento-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr; /* 左宽右窄 */
  gap: 20px;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* --- Card Common Styles --- */
.bento-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.bento-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.value-tag {
  background: #F4F4F5;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* --- Subject Card (Left) --- */
.subject-card {
  height: 520px; /* 固定高度以允许滚动 */
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F4F4F5;
  padding: 6px 12px;
  border-radius: 8px;
  width: 200px;
  transition: width 0.2s ease;
}

.search-input-wrapper:focus-within {
  background: #fff;
  box-shadow: 0 0 0 2px var(--primary-brand);
}

.bare-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
  color: var(--text-primary);
}

.subject-list {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding-right: 4px;
}

.subject-item {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.subject-item:hover {
  border-color: var(--text-tertiary);
  background: #FAFAFA;
}

.subject-item.active {
  border-color: var(--primary-brand);
  background: #F9FAFB;
  box-shadow: 0 0 0 1px var(--primary-brand);
}

.subject-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F4F4F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.subject-item.active .subject-icon {
  background: var(--primary-brand);
  color: #fff;
}

.subject-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 1px solid var(--primary-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-mark .dot {
  width: 8px;
  height: 8px;
  background: var(--primary-brand);
  border-radius: 50%;
}

/* --- Right Column Controls --- */

/* Segmented Control for Difficulty */
.segmented-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.segment-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid transparent;
  background: #F4F4F5;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.segment-btn:hover {
  background: #E4E4E7;
}

.segment-btn.active {
  background: #fff;
  border-color: var(--primary-brand);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.seg-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.seg-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Limit Selector */
.limit-selector {
  display: flex;
  gap: 12px;
}

.limit-presets {
  display: flex;
  gap: 8px;
  flex: 1;
}

.preset-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-subtle);
  background: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.preset-btn:hover {
  border-color: var(--text-tertiary);
}

.preset-btn.active {
  background: var(--primary-brand);
  color: #fff;
  border-color: var(--primary-brand);
}

.limit-input {
  width: 60px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  text-align: center;
  font-weight: 600;
  outline: none;
}
.limit-input:focus {
  border-color: var(--primary-brand);
}

/* Start Button */
.start-button {
  height: 64px;
  border: none;
  background: var(--primary-brand);
  color: #fff;
  border-radius: var(--radius-xl);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--primary-hover);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Scrollbar Utility */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E4E4E7;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #D4D4D8;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
