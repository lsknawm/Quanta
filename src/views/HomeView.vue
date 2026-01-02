<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import {
  VideoPlay,
  Reading,
  Connection,
  Operation,
  Trophy,
  Files
} from '@element-plus/icons-vue'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 表单状态 ---
const form = ref({
  subject: '',
  chapters: [],
  // 难度改用数字范围 [1, 5] 对应 [A, E]
  difficultyRange: [3, 3],
  limit: 10
})

// --- 难度滑块配置 ---
// 映射表：数字 -> 字符
const difficultyMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' }
// 滑块标记点
const difficultyMarks = {
  1: { style: { color: '#10b981' }, label: 'A' }, // Easy (Green)
  2: { style: { color: '#34d399' }, label: 'B' },
  3: { style: { color: '#fbbf24' }, label: 'C' }, // Medium (Yellow)
  4: { style: { color: '#f87171' }, label: 'D' },
  5: { style: { color: '#ef4444' }, label: 'E' }, // Hard (Red)
}

// --- 题量预设 ---
const limitPresets = [5, 10, 20, 50]

// --- 生命周期 ---
onMounted(() => {
  subjectStore.initData()
})

// --- 计算属性 ---

// 当前选中的学科对象
const currentSelectedSubject = computed(() => {
  return subjectStore.subjects.find(s => s.name === form.value.subject)
})

// 可选章节列表
const availableChapters = computed(() => {
  return currentSelectedSubject.value?.chapters || []
})

// 底部展示的有效学科卡片
const validSubjects = computed(() => {
  return subjectStore.subjects.filter(s => s.chapters && s.chapters.length > 0)
})

// 生成自然语言的配置总结 (用于直观反馈)
const configSummary = computed(() => {
  if (!form.value.subject) return '请先选择一个学科...'

  const chapCount = form.value.chapters.length
  const chapText = chapCount === 0 ? '全科随机' : `已选 ${chapCount} 章`
  const diffStart = difficultyMap[form.value.difficultyRange[0]]
  const diffEnd = difficultyMap[form.value.difficultyRange[1]]
  const diffText = diffStart === diffEnd ? `难度 ${diffStart}` : `难度 ${diffStart}-${diffEnd}`

  return `${form.value.subject} · ${chapText} · ${diffText} · ${form.value.limit} 题`
})

// --- 监听 ---

// 切换学科时重置章节
watch(() => form.value.subject, () => {
  form.value.chapters = []
})

// --- 动作 ---

const handleStartQuiz = () => {
  if (!form.value.subject) {
    // 简单的抖动效果或提示可以在这里加，目前用原生alert替代
    alert('请选择学科以开始')
    return
  }

  const queryParams = {
    subject: form.value.subject,
    chapters: form.value.chapters.join(','),
    difficulty_start: difficultyMap[form.value.difficultyRange[0]],
    difficulty_end: difficultyMap[form.value.difficultyRange[1]],
    limit: form.value.limit
  }

  router.push({ path: '/exam', query: queryParams })
}

const selectSubjectFromCard = (subjectName) => {
  form.value.subject = subjectName
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="home-container">
    <div class="ambient-light"></div>

    <section class="console-section">
      <div class="console-card">

        <div class="card-header">
          <div class="header-text">
            <h1>Start Practice</h1>
            <p>配置你的专属试卷</p>
          </div>
          <div class="header-icon">
            <el-icon><Operation /></el-icon>
          </div>
        </div>

        <div class="form-body">
          <div class="form-row main-selects">
            <div class="form-group subject-group">
              <label>目标学科</label>
              <el-select
                v-model="form.subject"
                placeholder="选择或搜索学科..."
                filterable
                size="large"
                class="custom-select"
                popper-class="custom-popper"
              >
                <el-option
                  v-for="sub in subjectStore.subjects"
                  :key="sub.name"
                  :label="sub.name"
                  :value="sub.name"
                >
                  <span class="option-label">{{ sub.name }}</span>
                  <span class="option-count">{{ sub.chapters.length }} 章</span>
                </el-option>
              </el-select>
            </div>

            <div class="form-group chapter-group">
              <label>章节范围 <span class="sub-label" v-if="form.chapters.length">(已选 {{ form.chapters.length }} 个)</span></label>
              <el-select
                v-model="form.chapters"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="默认包含所有章节"
                size="large"
                class="custom-select"
                :disabled="!form.subject"
                no-data-text="请先选择学科"
              >
                <el-option
                  v-for="chap in availableChapters"
                  :key="chap"
                  :label="chap"
                  :value="chap"
                />
              </el-select>
            </div>
          </div>

          <div class="form-row param-controls">

            <div class="form-group difficulty-group">
              <label>难度区间 <el-tag size="small" effect="plain" round>{{ difficultyMap[form.difficultyRange[0]] }} - {{ difficultyMap[form.difficultyRange[1]] }}</el-tag></label>
              <div class="slider-container">
                <el-slider
                  v-model="form.difficultyRange"
                  range
                  show-stops
                  :max="5"
                  :min="1"
                  :marks="difficultyMarks"
                  :format-tooltip="(val) => difficultyMap[val]"
                />
              </div>
            </div>

            <div class="form-group limit-group">
              <label>题目数量</label>
              <div class="limit-control">
                <el-input-number
                  v-model="form.limit"
                  :min="1"
                  :max="50"
                  controls-position="right"
                  size="large"
                  class="limit-input"
                />
                <div class="limit-presets">
                  <span
                    v-for="num in limitPresets"
                    :key="num"
                    class="preset-chip"
                    :class="{ active: form.limit === num }"
                    @click="form.limit = num"
                  >
                    {{ num }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="card-footer">
          <div class="summary-text">
            <el-icon><Files /></el-icon>
            <span>{{ configSummary }}</span>
          </div>
          <button class="action-btn" @click="handleStartQuiz">
            <span>生成试卷</span>
            <el-icon class="btn-icon"><VideoPlay /></el-icon>
          </button>
        </div>

      </div>
    </section>

    <section class="catalog-section">
      <div class="section-header">
        <h3>探索知识库</h3>
      </div>

      <div class="subjects-grid">
        <div
          v-for="subject in validSubjects"
          :key="subject.name"
          class="subject-card"
          @click="selectSubjectFromCard(subject.name)"
        >
          <div class="subject-icon">
            {{ subject.name.charAt(0) }}
          </div>
          <div class="subject-info">
            <h4>{{ subject.name }}</h4>
            <span class="meta">{{ subject.chapters.length }} 个章节</span>
          </div>
          <div class="hover-indicator">
            <el-icon><Connection /></el-icon>
          </div>
        </div>

        <div v-if="validSubjects.length === 0 && !subjectStore.isLoading" class="empty-state">
          暂无数据，请检查后端连接
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- Design Variables --- */
:root {
  --primary: #18181b;       /* Zinc 900 */
  --primary-hover: #27272a; /* Zinc 800 */
  --accent: #3b82f6;        /* Blue 500 */
  --bg-page: #f8fafc;
  --text-main: #1e293b;
  --text-sub: #64748b;
  --border: #e2e8f0;
  --radius-lg: 16px;
  --radius-md: 8px;
  --shadow-float: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.home-container {
  min-height: 100vh;
  background-color: var(--bg-page);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* --- Ambient Background --- */
.ambient-light {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(241,245,249,0.5) 60%, rgba(248,250,252,0) 100%);
  z-index: 0;
  pointer-events: none;
}

/* --- Console Section (Main Form) --- */
.console-section {
  position: relative;
  z-index: 10;
  padding: 60px 20px 40px;
  display: flex;
  justify-content: center;
}

.console-card {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  border: 1px solid rgba(255,255,255,0.6);
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card-header {
  padding: 32px 40px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(to bottom, #fff, #fafafa);
}

.header-text h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.header-text p {
  color: var(--text-sub);
  font-size: 0.95rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--text-main);
}

/* --- Form Body --- */
.form-body {
  padding: 40px;
}

.form-row {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.main-selects {
  align-items: flex-start;
}

/* Make it responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 24px;
  }
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-label {
  font-size: 0.75rem;
  color: var(--accent);
  text-transform: none;
}

/* Custom Select Styling Overrides */
:deep(.custom-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--border) inset !important;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

:deep(.custom-select .el-input__wrapper.is-focus),
:deep(.custom-select .el-input__wrapper:hover) {
  background-color: white;
  box-shadow: 0 0 0 2px var(--primary) inset !important;
}

.option-label {
  font-weight: 500;
  color: var(--text-main);
}
.option-count {
  float: right;
  color: var(--text-sub);
  font-size: 0.8rem;
}

/* --- Slider & Limit Controls --- */
.slider-container {
  padding: 0 12px; /* Prevent labels from cutting off */
  padding-top: 6px;
}

:deep(.el-slider__bar) {
  background-color: var(--primary);
}
:deep(.el-slider__button) {
  border-color: var(--primary);
  width: 16px;
  height: 16px;
}

.limit-control {
  display: flex;
  gap: 16px;
  align-items: center;
}

.limit-input {
  width: 140px;
}

.limit-presets {
  display: flex;
  gap: 8px;
}

.preset-chip {
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-sub);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.preset-chip:hover {
  background: #e2e8f0;
}

.preset-chip.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* --- Footer Actions --- */
.card-footer {
  padding: 24px 40px;
  background: #fafafa;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-sub);
  font-weight: 500;
}

.action-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.action-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

.action-btn:active {
  transform: translateY(0);
}

/* --- Catalog Section --- */
.catalog-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 5;
}

.section-header {
  margin-bottom: 24px;
  padding-left: 8px;
  border-left: 4px solid var(--primary);
}

.section-header h3 {
  font-size: 1.1rem;
  color: var(--text-main);
  margin: 0 0 0 12px;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.subject-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.subject-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.subject-icon {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  border: 1px solid #e2e8f0;
}

.subject-info h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-main);
}

.subject-info .meta {
  font-size: 0.8rem;
  color: var(--text-sub);
}

.hover-indicator {
  position: absolute;
  right: 20px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;
  color: var(--primary);
}

.subject-card:hover .hover-indicator {
  opacity: 1;
  transform: translateX(0);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-sub);
  background: white;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border);
}
</style>
