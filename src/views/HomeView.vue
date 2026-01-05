<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import {
  Search,
  VideoPlay
} from '@element-plus/icons-vue'
// 引入常量配置
import { DIFFICULTY_MAP, DEFAULT_LIMIT_PRESETS } from '../constants'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 状态 ---
const form = ref({
  subject: '',
  difficulty: 'B', // 默认 B
  limit: 10
})
const searchQuery = ref('')

// 将常量对象转换为数组供 v-for 使用
const difficultyOptions = Object.values(DIFFICULTY_MAP)
const limitPresets = DEFAULT_LIMIT_PRESETS

// --- 生命周期 ---
onMounted(() => {
  subjectStore.initData()
})

// --- 计算属性 ---

// 1. 科目搜索过滤
const filteredSubjects = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return subjectStore.subjects
    .filter(s => s.toLowerCase().includes(q))
    .map(s => ({
      name: s,
      avatar: s.charAt(0).toUpperCase()
    }))
})

// 2. 获取当前选中难度的配置对象（用于动态样式）
const currentDiffConfig = computed(() => {
  return DIFFICULTY_MAP[form.value.difficulty] || DIFFICULTY_MAP['B']
})

// --- 动作 ---

const selectSubject = (subName) => {
  form.value.subject = subName
}

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
</script>

<template>
  <div class="app-container">
    <div class="bg-decoration"></div>

    <div class="content-wrapper">

      <header class="page-header">
        <h1>
          <span class="gradient-text">Boson</span> Quiz Engine
        </h1>
        <p class="subtitle">构建您的专属知识挑战，探索智能评估的新维度。</p>
      </header>

      <div class="main-dashboard">

        <section class="panel subject-panel">
          <div class="panel-header">
            <h3>
              <el-icon><Search /></el-icon> 选择目标题库
            </h3>
            <div class="search-bar">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索学科..."
              >
            </div>
          </div>

          <div class="subject-wall custom-scrollbar">
            <div
              v-for="sub in filteredSubjects"
              :key="sub.name"
              class="subject-chip"
              :class="{ active: form.subject === sub.name }"
              @click="selectSubject(sub.name)"
            >
              <div class="chip-avatar">{{ sub.avatar }}</div>
              <span class="chip-name">{{ sub.name }}</span>
              <div class="active-indicator" v-if="form.subject === sub.name"></div>
            </div>

            <div v-if="filteredSubjects.length === 0 && !subjectStore.isLoading" class="empty-state">
              暂无匹配的学科
            </div>
            <div v-if="subjectStore.isLoading" class="loading-state">
              加载题库中...
            </div>
          </div>
        </section>

        <section class="config-console">

          <div class="panel config-panel">
            <div class="panel-header">
              <h3>难度等级</h3>
            </div>
            <div class="difficulty-grid">
              <div
                v-for="diff in difficultyOptions"
                :key="diff.value"
                class="diff-card"
                :class="{ active: form.difficulty === diff.value }"
                @click="form.difficulty = diff.value"
                :style="{
                  '--theme-color': diff.color,
                  '--theme-bg': diff.bg
                }"
              >
                <div class="diff-icon">
                  <el-icon><component :is="diff.icon" /></el-icon>
                </div>
                <div class="diff-info">
                  <div class="diff-label">
                    {{ diff.label }} <span class="sub">{{ diff.sub }}</span>
                  </div>
                  <div class="diff-desc">{{ diff.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel footer-panel">
            <div class="limit-section">
              <label>生成题量</label>
              <div class="limit-controls">
                <div class="presets">
                    <span
                      v-for="num in limitPresets"
                      :key="num"
                      class="preset-tag"
                      :class="{ active: form.limit === num }"
                      @click="form.limit = num"
                    >{{ num }}</span>
                </div>
                <input
                  v-model.number="form.limit"
                  type="number"
                  min="1" max="50"
                  class="limit-input"
                >
              </div>
            </div>

            <button
              class="start-btn"
              :disabled="!form.subject"
              @click="handleStartQuiz"
              :style="{ background: currentDiffConfig.color }"
            >
              <span class="btn-content">
                开始生成试卷
                <el-icon class="el-icon--right"><VideoPlay /></el-icon>
              </span>
            </button>
          </div>

        </section>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 局部样式配合 main.css 使用 */
.app-container {
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-page);
}

.bg-decoration {
  position: absolute;
  top: -20%; left: -10%;
  width: 50%; height: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 10px 0;
}
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.main-dashboard {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 800px) {
  .main-dashboard { grid-template-columns: 1fr; }
}

.panel {
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: 24px;
  box-shadow: var();
  transition: transform 0.2s;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.panel-header h3 {
  margin: 0;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
}

/* --- Subject Panel --- */
.subject-panel {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.search-bar input {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  outline: none;
  width: 180px;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.search-bar input:focus {
  background: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-focus);
}

.subject-wall {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
  overflow-y: auto;
  max-height: 400px;
}

.subject-chip {
  padding: 8px 16px 8px 8px;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.subject-chip:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.subject-chip.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.chip-avatar {
  width: 32px; height: 32px;
  background: #fff;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
}
.subject-chip.active .chip-avatar {
  background: var(--color-primary);
  color: #fff;
}

.empty-state, .loading-state {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
}

/* --- Difficulty Panel --- */
.config-console {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.diff-card {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--bg-surface);
  transition: all 0.2s;
  /* 使用 CSS 变量传递颜色 */
  --local-color: var(--text-secondary);
}

.diff-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-surface-alt);
}

.diff-card.active {
  background: var();
  border-color: var();
}

.diff-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: var(); /* 始终显示已配置的颜色 */
}

.diff-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
}
.diff-label .sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 400;
}
.diff-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* --- Footer Panel --- */
.limit-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.limit-section label {
  font-weight: 600;
  color: var(--text-main);
}

.presets {
  display: flex;
  background: var(--bg-input);
  padding: 4px;
  border-radius: var(--radius-md);
  gap: 4px;
}
.preset-tag {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.preset-tag:hover { color: var(--text-main); }
.preset-tag.active {
  background: #fff;
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.limit-input {
  width: 60px;
  margin-left: 12px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 6px;
  outline: none;
}
.limit-input:focus { border-color: var(--color-primary); }

.start-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-md);
}
.start-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--text-placeholder) !important;
}
.btn-content {
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
</style>
