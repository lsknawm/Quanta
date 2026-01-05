<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import {
  Search,
  VideoPlay,
  Trophy,
  DataAnalysis,
  Timer,
  Collection
} from '@element-plus/icons-vue'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 状态管理 ---
const form = ref({
  subject: '',
  difficulty: 'B',
  limit: 10
})
const searchQuery = ref('')

// --- 难度配置 (带直观的颜色和描述) ---
const difficultyOptions = [
  { value: 'A', label: '新手', sub: 'Basic', color: '#10B981', desc: '基础概念巩固' },    // Emerald
  { value: 'B', label: '进阶', sub: 'Advanced', color: '#3B82F6', desc: '核心知识应用' }, // Blue
  { value: 'C', label: '挑战', sub: 'Hard', color: '#F59E0B', desc: '复杂场景分析' },     // Amber
  { value: 'D', label: '噩梦', sub: 'Expert', color: '#EF4444', desc: '极限边界情况' }    // Red
]

const limitPresets = [5, 10, 15, 20, 50]

// --- 生命周期 ---
onMounted(() => {
  subjectStore.initData()
})

// --- 逻辑处理 ---
const filteredSubjects = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return subjectStore.subjects.filter(s => s.toLowerCase().includes(q))
})

// 根据当前难度获取对应颜色，用于按钮等动态样式
const currentThemeColor = computed(() => {
  const diff = difficultyOptions.find(d => d.value === form.value.difficulty)
  return diff ? diff.color : '#3B82F6'
})

const selectSubject = (sub) => {
  form.value.subject = sub
}

const handleStart = () => {
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

    <div class="main-content">

      <header class="header-section">
        <h1>开始你的练习</h1>
        <p>选择科目与难度，定制专属试卷</p>
      </header>

      <div class="dashboard-card">

        <div class="left-panel">
          <div class="panel-header">
            <h3><el-icon><Collection /></el-icon> 目标题库</h3>
            <div class="search-box">
              <el-icon class="search-icon"><Search /></el-icon>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索科目..."
              />
            </div>
          </div>

          <div class="subject-grid custom-scroll">
            <div
              v-for="sub in filteredSubjects"
              :key="sub"
              class="subject-item"
              :class="{ active: form.subject === sub }"
              @click="selectSubject(sub)"
            >
              <div class="subject-avatar">
                {{ sub.charAt(0).toUpperCase() }}
              </div>
              <div class="subject-info">
                <span class="name">{{ sub }}</span>
                <span class="status" v-if="form.subject === sub">已选中</span>
                <span class="status hint" v-else>点击选择</span>
              </div>
              <div class="check-mark" v-if="form.subject === sub">✓</div>
            </div>

            <div v-if="filteredSubjects.length === 0" class="empty-state">
              未找到相关科目
            </div>
          </div>
        </div>

        <div class="right-panel">

          <div class="config-section">
            <label><el-icon><Trophy /></el-icon> 难度等级</label>
            <div class="difficulty-list">
              <div
                v-for="opt in difficultyOptions"
                :key="opt.value"
                class="diff-option"
                :class="{ active: form.difficulty === opt.value }"
                :style="form.difficulty === opt.value ? { borderColor: opt.color, backgroundColor: `${opt.color}10` } : {}"
                @click="form.difficulty = opt.value"
              >
                <div class="diff-radio" :style="{ borderColor: form.difficulty === opt.value ? opt.color : '#cbd5e1' }">
                  <div class="dot" :style="{ backgroundColor: opt.color }" v-show="form.difficulty === opt.value"></div>
                </div>
                <div class="diff-content">
                  <div class="diff-title" :style="{ color: form.difficulty === opt.value ? opt.color : '' }">
                    {{ opt.label }} <span class="sub-text">{{ opt.sub }}</span>
                  </div>
                  <div class="diff-desc">{{ opt.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="config-section">
            <label><el-icon><DataAnalysis /></el-icon> 题目数量</label>
            <div class="limit-selector">
              <div class="slider-wrapper">
                <input
                  type="range"
                  v-model.number="form.limit"
                  min="5" max="50" step="5"
                  class="range-slider"
                  :style="{ accentColor: currentThemeColor }"
                />
                <div class="slider-value">{{ form.limit }} 题</div>
              </div>
              <div class="preset-chips">
                <span
                  v-for="n in limitPresets"
                  :key="n"
                  class="chip"
                  :class="{ active: form.limit === n }"
                  @click="form.limit = n"
                >{{ n }}</span>
              </div>
            </div>
          </div>

          <div class="action-area">
            <button
              class="start-btn"
              :disabled="!form.subject"
              :style="{ backgroundColor: !form.subject ? '#94a3b8' : currentThemeColor }"
              @click="handleStart"
            >
              <span v-if="!form.subject">请先选择科目</span>
              <span v-else class="btn-text">
                开始测验 <el-icon><VideoPlay /></el-icon>
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 基础布局与背景 --- */
.app-container {
  min-height: calc(100vh - 64px);
  background-color: #F8FAFC; /* Slate 50 */
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #334155;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #E0E7FF 0%, #F8FAFC 100%); /* Indigo tint */
  z-index: 0;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
}

.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* --- 头部 --- */
.header-section h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1E293B;
  margin: 0 0 8px 0;
  letter-spacing: -0.03em;
}
.header-section p {
  color: #64748B;
  font-size: 1.05rem;
  margin: 0;
}

/* --- 主卡片容器 --- */
.dashboard-card {
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.03);
  display: flex;
  overflow: hidden;
  min-height: 600px;
}

@media (max-width: 800px) {
  .dashboard-card { flex-direction: column; }
}

/* --- 左侧面板 (Subject) --- */
.left-panel {
  flex: 3;
  padding: 32px;
  background-color: #fff;
  border-right: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 搜索框 */
.search-box {
  position: relative;
  width: 200px;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
}
.search-box input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.search-box input:focus {
  background: #fff;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 学科网格列表 */
.subject-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: max-content;
  gap: 16px;
  overflow-y: auto;
  padding: 4px;
}

.subject-item {
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #fff;
}

.subject-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #CBD5E1;
}

.subject-item.active {
  border-color: #3B82F6;
  background-color: #EFF6FF; /* Blue 50 */
  box-shadow: 0 0 0 2px #3B82F6 inset;
}

.subject-avatar {
  width: 44px;
  height: 44px;
  background: #F1F5F9;
  color: #64748B;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.subject-item.active .subject-avatar {
  background: #3B82F6;
  color: #fff;
}

.subject-info {
  display: flex;
  flex-direction: column;
}
.subject-info .name {
  font-weight: 600;
  color: #1E293B;
  font-size: 0.95rem;
}
.subject-info .status {
  font-size: 0.75rem;
  color: #3B82F6;
  font-weight: 500;
}
.subject-info .hint {
  color: #94A3B8;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s;
}
.subject-item:hover .hint {
  opacity: 1;
  transform: translateX(0);
}

.check-mark {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #3B82F6;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* --- 右侧面板 (Config) --- */
.right-panel {
  flex: 2;
  background-color: #FAFAFA; /* Very light gray */
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.config-section label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

/* 难度选项列表 */
.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.diff-option {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-option:hover {
  border-color: #CBD5E1;
  background-color: #fff;
}

.diff-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.diff-radio .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.diff-content {
  display: flex;
  flex-direction: column;
}
.diff-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1E293B;
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.sub-text {
  font-size: 0.75rem;
  color: #94A3B8;
  font-weight: 400;
}
.diff-desc {
  font-size: 0.8rem;
  color: #64748B;
  margin-top: 2px;
}

/* 题量选择 */
.limit-selector {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.range-slider {
  flex: 1;
  cursor: pointer;
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  -webkit-appearance: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  border: 2px solid currentColor; /* Takes accent-color */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: -6px; /* center it */
}

.slider-value {
  font-weight: 700;
  color: #1E293B;
  min-width: 40px;
  text-align: right;
}

.preset-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  padding: 4px 12px;
  border-radius: 20px;
  background: #F1F5F9;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
}
.chip:hover { background: #E2E8F0; }
.chip.active {
  background: #1E293B;
  color: white;
}

/* 底部按钮 */
.action-area {
  margin-top: auto;
}
.start-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
.start-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
.btn-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 滚动条美化 */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #94A3B8;
}
</style>
