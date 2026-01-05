<script setup>
import { computed } from 'vue'
import {
  Trophy,
  PriceTag// 用于题型图标
} from '@element-plus/icons-vue'

const props = defineProps({
  // 只接收必要的元数据，不接收 content/structure
  index: {
    type: Number,
    required: true
  },
  // 包含 type, difficulty, score 等
  meta: {
    type: Object,
    default: () => ({})
  }
})

// 难度样式映射
const difficultyConfig = computed(() => {
  const map = {
    'A': { color: '#10B981', bg: '#ECFDF5', label: 'Basic' },
    'B': { color: '#3B82F6', bg: '#EFF6FF', label: 'Advanced' },
    'C': { color: '#F59E0B', bg: '#FFFBEB', label: 'Hard' },
    'D': { color: '#EF4444', bg: '#FEF2F2', label: 'Expert' }
  }
  return map[props.meta.difficulty] || map['B']
})

const typeName = computed(() => {
  const types = {
    'single_choice': '单选',
    'multiple_choice': '多选',
    'true_false': '判断',
    'fill_blank': '填空'
  }
  return types[props.meta.type] || '题目'
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
        <div class="type-badge">
          {{ typeName }}
        </div>
      </div>

      <div class="header-right">
        <div class="meta-pill"
             :style="{ backgroundColor: difficultyConfig.bg, color: difficultyConfig.color }">
          <el-icon>
            <Trophy />
          </el-icon>
          <span>{{ difficultyConfig.label }}</span>
        </div>
        <div class="meta-pill score-pill">
          <el-icon>
            <PriceTag />
          </el-icon>
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
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #F1F5F9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-container:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
}

/* --- Header --- */
.card-header {
  padding: 16px 24px;
  background: #FAFAFA; /* Zinc 50 */
  border-bottom: 1px solid #F1F5F9;
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
  color: #1E293B;
  font-size: 1.2rem;
  display: flex;
  align-items: baseline;
}

.index-num .prefix {
  font-size: 0.8rem;
  color: #94A3B8;
  margin-right: 2px;
}

.type-badge {
  font-size: 0.8rem;
  font-weight: 600;
  background: #F4F4F5;
  color: #52525B;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #E4E4E7;
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
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
}

.score-pill {
  background: #FFF7ED; /* Orange 50 */
  color: #EA580C; /* Orange 600 */
}

/* --- Content Wrapper --- */
.card-content-wrapper {
  padding: 32px;
  /* 让插槽内容撑开高度 */
  flex: 1;
}

.empty-state {
  color: #A1A1AA;
  text-align: center;
  padding: 20px;
  border: 2px dashed #E4E4E7;
  border-radius: 8px;
}
</style>
