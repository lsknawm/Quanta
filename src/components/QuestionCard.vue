<script setup>
import { computed } from 'vue'
import {
  Trophy,
  PriceTag
} from '@element-plus/icons-vue'
// 引入常量配置
import { DIFFICULTY_MAP, QUESTION_TYPES } from '../constants'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  meta: {
    type: Object,
    default: () => ({})
  }
})

// 1. 使用常量获取难度配置 (颜色、背景、Icon等)
const difficultyConfig = computed(() => {
  const diff = props.meta.difficulty
  return DIFFICULTY_MAP[diff] || DIFFICULTY_MAP['B']
})

// 2. 使用常量获取题型名称
const typeConfig = computed(() => {
  const type = props.meta.type
  // 提供默认值防止 undefined 报错
  return QUESTION_TYPES[type] || {
    label: '未知题型',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-color)'
  }
})
</script>

<template>
  <div class="question-container">

    <div class="card-header">
      <div class="header-left">
        <div class="index-num">
          <span class="prefix">Q</span>
          <span class="val">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>

        <div
          class="type-badge"
          :style="{
            color: typeConfig.color,
            borderColor: typeConfig.color,
            backgroundColor: 'var(--bg-surface)'
          }"
        >
          {{ typeConfig.label }}
        </div>
      </div>

      <div class="header-right">
        <div
          class="meta-pill"
          :style="{
            backgroundColor: difficultyConfig.bg,
            color: difficultyConfig.color
          }"
        >
          <el-icon><Trophy /></el-icon>
          <span>{{ difficultyConfig.label }}</span>
        </div>

        <div class="meta-pill score-pill">
          <el-icon><PriceTag /></el-icon>
          <span>{{ meta.score || 1 }} 分</span>
        </div>
      </div>
    </div>

    <div class="card-content-wrapper">
      <slot>
        <div class="empty-state">暂无题目内容</div>
      </slot>
    </div>

  </div>
</template>

<style scoped>
.question-container {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.question-container:hover {
  box-shadow: var(--shadow-float);
}

/* --- Header --- */
.card-header {
  padding: 16px 24px;
  background: var(--bg-surface-alt);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.index-num {
  font-family: 'Monaco', 'Consolas', monospace;
  font-weight: 700;
  color: var(--text-main);
  font-size: 1.2rem;
  display: flex;
  align-items: baseline;
}
.index-num .prefix {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-right: 2px;
}

.type-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent; /* 颜色由内联样式控制 */
}

.header-right {
  display: flex;
  gap: 8px;
}

.meta-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.score-pill {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

/* --- Content Wrapper --- */
.card-content-wrapper {
  padding: 32px;
  flex: 1;
}

.empty-state {
  color: var(--text-placeholder);
  text-align: center;
  padding: 20px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
}

@media (max-width: 640px) {
  .card-header {
    padding: 12px 16px;
  }
  .card-content-wrapper {
    padding: 20px;
  }
}
</style>
