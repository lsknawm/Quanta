<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import {
  ArrowRight,
  Search,
  DataBoard,
  TrendCharts,
  Medal,
  Trophy
} from '@element-plus/icons-vue'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 状态 ---
const form = ref({
  subject: '',
  difficulty: 'B',
  limit: 10
})
const searchQuery = ref('')

// --- 选项配置 (带视觉主题色) ---
const difficulties = [
  { value: 'A', label: '入门 Basic', desc: '筑基阶段', color: 'teal', icon: DataBoard },
  { value: 'B', label: '进阶 Advanced', desc: '核心应用', color: 'blue', icon: TrendCharts },
  { value: 'C', label: '专家 Expert', desc: '复杂挑战', color: 'indigo', icon: Medal },
  { value: 'D', label: '大师 Master', desc: '极限场景', color: 'purple', icon: Trophy }
]

const limitPresets = [5, 10, 20, 30]

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

// 科目过滤与选择
const filteredSubjects = computed(() => {
  const q = searchQuery.value.toLowerCase()
  // 简单的字母映射作为图标占位符
  return subjectStore.subjects
    .filter(s => s.toLowerCase().includes(q))
    .map(s => ({ name: s, avatar: s.charAt(0).toUpperCase() }))
})

const selectSubject = (subName) => {
  form.value.subject = subName
}

// 获取当前难度的颜色主题
const currentDifficultyTheme = computed(() => {
  return difficulties.find(d => d.value === form.value.difficulty)?.color || 'blue'
})
</script>

<template>
  <div class="premium-container">
    <div class="ambient-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="content-wrapper">

      <header class="page-header animated-fade-down">
        <h1>
          <span class="gradient-text">Boson</span> Quiz Engine
        </h1>
        <p class="subtitle">构建您的专属知识挑战，探索智能评估的新维度。</p>
      </header>

      <div class="main-dashboard animated-fade-up">

        <section class="glass-panel subject-panel">
          <div class="panel-header">
            <h3>
              <span class="icon-wrapper"><el-icon><Search /></el-icon></span>
              选择目标题库
            </h3>
            <div class="search-bar">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索学科..."
                class="glass-input"
              >
            </div>
          </div>

          <div class="subject-wall custom-scrollbar">
            <div
              v-for="sub in filteredSubjects"
              :key="sub.name"
              class="subject-chip glass-card"
              :class="{ active: form.subject === sub.name }"
              @click="selectSubject(sub.name)"
            >
              <div class="chip-avatar">{{ sub.avatar }}</div>
              <span class="chip-name">{{ sub.name }}</span>
              <div class="active-glow"></div>
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

          <div class="glass-panel config-panel">
            <div class="panel-header">
              <h3>难度等级设定</h3>
            </div>
            <div class="difficulty-grid">
              <div
                v-for="diff in difficulties"
                :key="diff.value"
                class="diff-card glass-card"
                :class="[diff.color, { active: form.difficulty === diff.value }]"
                @click="form.difficulty = diff.value"
              >
                <div class="diff-icon">
                  <el-icon><component :is="diff.icon" /></el-icon>
                </div>
                <div class="diff-info">
                  <div class="diff-label">{{ diff.label }}</div>
                  <div class="diff-desc">{{ diff.desc }}</div>
                </div>
                <div class="selection-ring"></div>
              </div>
            </div>
          </div>

          <div class="glass-panel config-panel footer-panel" :class="currentDifficultyTheme + '-theme'">
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
                  class="glass-input limit-input"
                >
              </div>
            </div>

            <button
              class="start-btn magnetic-effect"
              :disabled="!form.subject"
              @click="handleStartQuiz"
            >
              <span class="btn-content">
                开始生成试卷
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </span>
              <div class="btn-glow"></div>
            </button>
          </div>

        </section>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- Design System Theme --- */
:root {
  --bg-app: #F0F2F5;
  --text-primary: #2D3748;
  --text-secondary: #718096;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  --blur-strength: 20px;

  /* Theme Colors */
  --color-teal: #38B2AC;
  --color-blue: #4299E1;
  --color-indigo: #667EEA;
  --color-purple: #9F7AEA;
  --primary-gradient: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
}

.premium-container {
  min-height: calc(100vh - 60px);
  background-color: var(--bg-app);
  background-image: linear-gradient(to bottom right, #F0F2F5, #E6E9F0);
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- Ambient Background Effects --- */
.ambient-blobs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  animation: moveBlob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}
.blob-1 {
  top: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: var(--color-blue);
  animation-delay: -5s;
}
.blob-2 {
  bottom: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: var(--color-purple);
}

@keyframes moveBlob {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(100px, 50px) scale(1.1); }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
}

/* --- Typography & Header --- */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}
.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* --- Glassmorphism Components --- */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-strength));
  -webkit-backdrop-filter: blur(var(--blur-strength));
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: 28px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.glass-input {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 16px;
  border-radius: 12px;
  outline: none;
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
}
.glass-input:focus {
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--color-blue);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}
.icon-wrapper {
  display: flex;
  padding: 8px;
  background: rgba(66, 153, 225, 0.1);
  color: var(--color-blue);
  border-radius: 10px;
}

/* --- Main Dashboard Layout --- */
.main-dashboard {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  align-items: start;
}
@media (max-width: 900px) {
  .main-dashboard { grid-template-columns: 1fr; }
}

/* --- Subject Wall (Left) --- */
.subject-panel {
  min-height: 550px;
  display: flex;
  flex-direction: column;
}
.search-bar .glass-input {
  width: 220px;
}
.subject-wall {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
  overflow-y: auto;
  padding: 4px; /* Prevent shadow clipping */
}

.subject-chip {
  padding: 10px 16px 10px 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.subject-chip:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 6px 15px rgba(0,0,0,0.05);
}
.chip-avatar {
  width: 36px;
  height: 36px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.chip-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.subject-chip.active {
  background: white;
  border-color: var(--color-indigo);
}
.active-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.subject-chip.active .active-glow {
  opacity: 1;
}

/* --- Config Console (Right) --- */
.config-console {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Difficulty Grid */
.difficulty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.diff-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  position: relative;
  border-width: 2px;
}
.diff-card:hover {
  transform: scale(1.03);
}

/* Difficulty Color Themes */
.diff-card.teal { --theme-color: var(--color-teal); }
.diff-card.blue { --theme-color: var(--color-blue); }
.diff-card.indigo { --theme-color: var(--color-indigo); }
.diff-card.purple { --theme-color: var(--color-purple); }

.diff-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--theme-color);
  transition: all 0.3s ease;
}
.diff-label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}
.diff-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.diff-card.active {
  background: white;
  border-color: var(--theme-color);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05), 0 0 0 4px rgba(var(--theme-color-rgb), 0.1);
}
.diff-card.active .diff-icon {
  background: var(--theme-color);
  color: white;
  box-shadow: 0 4px 10px rgba(var(--theme-color-rgb), 0.3);
}

/* Footer Panel & Controls */
.footer-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.3s ease;
}
/* 根据选择的难度改变底部面板的强调色光晕 */
.footer-panel.teal-theme { box-shadow: 0 8px 32px rgba(56, 178, 172, 0.15); }
.footer-panel.blue-theme { box-shadow: 0 8px 32px rgba(66, 153, 225, 0.15); }
.footer-panel.indigo-theme { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15); }
.footer-panel.purple-theme { box-shadow: 0 8px 32px rgba(159, 122, 234, 0.15); }

.limit-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.limit-section label {
  font-weight: 600;
  color: var(--text-primary);
}
.limit-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}
.presets {
  display: flex;
  background: rgba(255,255,255,0.4);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.5);
}
.preset-tag {
  padding: 6px 14px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.preset-tag.active {
  background: white;
  color: var(--color-indigo);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.limit-input {
  width: 70px;
  text-align: center;
  font-weight: 700;
}

/* Start Button (Hero Element) */
.start-btn {
  position: relative;
  border: none;
  height: 64px;
  border-radius: 16px;
  background: var(--primary-gradient);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-content {
  position: relative;
  z-index: 2;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: 1;
}
.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.5);
}
.start-btn:hover .btn-glow {
  transform: translateX(100%);
}
.start-btn:disabled {
  opacity: 0.6;
  filter: grayscale(0.5);
  cursor: not-allowed;
}

/* --- Utilities & Animations --- */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; }

.empty-state, .loading-state {
  width: 100%;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

.animated-fade-down { animation: fadeDown 0.8s ease-out; }
.animated-fade-up { animation: fadeUp 0.8s ease-out 0.2s backwards; }

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
