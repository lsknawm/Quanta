<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subject'
import { VideoPlay, Connection, Reading, Filter } from '@element-plus/icons-vue'

const router = useRouter()
const subjectStore = useSubjectStore()

// --- 表单状态 ---
const form = ref({
  subject: '',
  chapters: [],
  difficultyStart: 'C', // 默认 C
  difficultyEnd: '',    // 可选
  limit: 10
})

// 难度选项 (根据用户偏好 ABCDE)
const difficultyOptions = ['A', 'B', 'C', 'D', 'E']

// --- 生命周期 ---
onMounted(() => {
  subjectStore.initData()
})

// --- 计算属性 & 监听 ---

// 1. 获取当前选中学科的详细对象
const currentSelectedSubject = computed(() => {
  return subjectStore.subjects.find(s => s.name === form.value.subject)
})

// 2. 动态计算章节选项：依赖于当前选中的学科
const availableChapters = computed(() => {
  return currentSelectedSubject.value?.chapters || []
})

// 3. 监听学科变化：当切换学科时，清空已选的章节，避免数据串味
watch(() => form.value.subject, () => {
  form.value.chapters = []
})

// 4. 底部展示区：过滤掉没有章节的空学科
const validSubjects = computed(() => {
  return subjectStore.subjects.filter(s => s.chapters && s.chapters.length > 0)
})

// --- 动作 ---

// 开始刷题：跳转并携带参数
const handleStartQuiz = () => {
  if (!form.value.subject) {
    // 简单的校验提示，实际可用 ElMessage
    alert('请先选择一个学科')
    return
  }

  const queryParams = {
    subject: form.value.subject,
    // 如果没选章节，传空通常代表全选，具体看后端逻辑；这里转为字符串或通过 state 传递
    chapters: form.value.chapters.join(','),
    difficulty_start: form.value.difficultyStart,
    difficulty_end: form.value.difficultyEnd,
    limit: form.value.limit
  }

  // 跳转到考试页面
  router.push({
    path: '/exam',
    query: queryParams
  })
}

// 点击底部卡片快速填充表单
const selectSubjectFromCard = (subjectName) => {
  form.value.subject = subjectName
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="home-container">

    <section class="generator-section">
      <div class="generator-card">
        <div class="card-header">
          <h2><el-icon><Filter /></el-icon> 配置你的练习</h2>
          <p>定制专属题组，精准突破薄弱点。</p>
        </div>

        <el-form :model="form" label-position="top" class="quiz-form">
          <el-row :gutter="20">
            <el-col :span="8" :xs="24">
              <el-form-item label="目标学科">
                <el-select
                  v-model="form.subject"
                  placeholder="选择学科..."
                  filterable
                  size="large"
                  class="full-width"
                >
                  <el-option
                    v-for="sub in subjectStore.subjects"
                    :key="sub.name"
                    :label="sub.name"
                    :value="sub.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="16" :xs="24">
              <el-form-item label="限定章节 (可选)">
                <el-select
                  v-model="form.chapters"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="全部章节 (默认)"
                  size="large"
                  class="full-width"
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
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <el-form-item label="难度范围">
                <div class="difficulty-group">
                  <el-select v-model="form.difficultyStart" placeholder="起始" size="large">
                    <el-option v-for="d in difficultyOptions" :key="d" :label="d" :value="d" />
                  </el-select>
                  <span class="separator">-</span>
                  <el-select v-model="form.difficultyEnd" placeholder="结束 (可选)" clearable size="large">
                    <el-option v-for="d in difficultyOptions" :key="d" :label="d" :value="d" />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12" :xs="24">
              <el-form-item label="题目数量">
                <el-input-number
                  v-model="form.limit"
                  :min="1"
                  :max="50"
                  size="large"
                  class="full-width"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="form-action">
            <el-button type="primary" size="large" class="start-btn" @click="handleStartQuiz">
              <el-icon><VideoPlay /></el-icon>
              生成试卷并开始
            </el-button>
          </div>
        </el-form>
      </div>
    </section>

    <section class="catalog-section">
      <div class="section-title">
        <h3>全站知识库</h3>
        <span class="badge">{{ validSubjects.length }} 个学科</span>
      </div>

      <div class="subjects-grid">
        <transition-group name="fade">
          <div
            v-for="subject in validSubjects"
            :key="subject.name"
            class="subject-card"
            @click="selectSubjectFromCard(subject.name)"
          >
            <div class="card-top">
              <div class="icon-box">
                <el-icon><Reading /></el-icon>
              </div>
              <h4>{{ subject.name }}</h4>
            </div>

            <div class="card-body">
              <p class="chapter-preview">
                包含 {{ subject.chapters[0] }}
                <span v-if="subject.chapters.length > 1">等 {{ subject.chapters.length }} 章</span>
              </p>
            </div>

            <div class="card-hover-action">
              点击选中 <el-icon><Connection /></el-icon>
            </div>
          </div>
        </transition-group>
      </div>

      <el-empty
        v-if="validSubjects.length === 0 && !subjectStore.isLoading"
        description="暂无学科数据"
      />
    </section>

  </div>
</template>

<style scoped>
/* Design System: Modern SaaS (Linear/Stripe inspired)
  Colors: Monochrome with subtle accents
*/
:root {
  --bg-page: #f7f9fc;
  --bg-card: #ffffff;
  --text-primary: #1a1f36;
  --text-secondary: #697386;
  --primary-color: #111111;
  --border-light: #e3e8ee;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --radius: 12px;
}

.home-container {
  min-height: 100vh;
  background-color: #f7f9fc; /* 浅灰背景 */
  padding-bottom: 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}

/* --- Generator Section --- */
.generator-section {
  background: white;
  border-bottom: 1px solid var(--border-light);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.generator-card {
  width: 100%;
  max-width: 800px;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1f36;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header p {
  color: #697386;
  margin-bottom: 32px;
}

.quiz-form {
  /* Element Plus 覆盖 */
  --el-input-focus-border-color: #000;
  --el-select-input-focus-border-color: #000;
}

.full-width {
  width: 100%;
}

.difficulty-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  color: #8792a2;
}

.form-action {
  margin-top: 24px;
}

.start-btn {
  width: 100%;
  background-color: #1a1f36;
  border-color: #1a1f36;
  font-weight: 600;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.start-btn:hover {
  background-color: #000;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.start-btn:active {
  transform: translateY(0);
}

/* --- Catalog Section --- */
.catalog-section {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-title h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #3c4257;
  margin: 0;
}

.badge {
  background: #e3e8ee;
  color: #4f566b;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.subject-card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.subject-card:hover {
  border-color: #c1c9d2;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.icon-box {
  width: 32px;
  height: 32px;
  background: #f7f9fc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1f36;
}

.card-top h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1f36;
}

.chapter-preview {
  font-size: 0.85rem;
  color: #697386;
  line-height: 1.4;
  margin: 0;
}

/* Hover Action Hint */
.card-hover-action {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  background: #f7f9fc;
  color: #1a1f36;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.2s ease;
  border-top: 1px solid var(--border-light);
}

.subject-card:hover .card-hover-action {
  opacity: 1;
  transform: translateY(0);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
