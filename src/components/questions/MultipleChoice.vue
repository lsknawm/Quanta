<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// 生成 A, B, C, D 序号
const getIndexLabel = (index) => {
  return String.fromCharCode(65 + index)
}

// 切换选中状态
const toggleOption = (id) => {
  // 复制一份当前数组，避免直接修改 prop
  const currentSelected = [...props.modelValue]
  const idx = currentSelected.indexOf(id)

  if (idx > -1) {
    // 已选 -> 移除
    currentSelected.splice(idx, 1)
  } else {
    // 未选 -> 添加
    currentSelected.push(id)
  }

  emit('update:modelValue', currentSelected)
}
</script>

<template>
  <div class="multiple-choice">
    <div class="guide-text">
      <span class="tag">多选</span> 请选择所有正确的选项
    </div>

    <div class="options-list">
      <div
        v-for="(opt, index) in question.structure.options"
        :key="opt.id"
        class="option-card"
        :class="{ active: modelValue.includes(opt.id) }"
        @click="toggleOption(opt.id)"
      >
        <div class="opt-label">{{ getIndexLabel(index) }}</div>

        <div class="opt-content">
          <div class="opt-text">{{ opt.text }}</div>
          <div v-if="opt.has_image" class="opt-image-box">
            <img :src="opt.image" alt="Option Image" loading="lazy" />
          </div>
        </div>

        <div class="checkbox-indicator">
          <div class="checkbox-box">
            <svg v-if="modelValue.includes(opt.id)" viewBox="0 0 1024 1024" width="12" height="12">
              <path
                d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z"
                fill="#fff" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-text {
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-text .tag {
  background: var(--color-primary-light, #dbeafe);
  color: var(--color-primary, #2563eb);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  background-color: var(--bg-surface, #fff);
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: var(--color-primary-light, #93c5fd);
  background-color: var( #f8fafc);
}

.option-card.active {
  border-color: var(--color-primary, #3b82f6);
  background-color: var( #eff6ff);
  box-shadow: 0 0 0 1px var(--color-primary, #3b82f6);
}

.opt-label {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: var(--bg-surface-alt, #f1f5f9);
  color: var(--text-secondary, #64748b);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 16px;
  transition: all 0.2s;
}

.option-card.active .opt-label {
  background: var(--color-primary, #3b82f6);
  color: #fff;
}

.opt-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opt-text {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-main, #334155);
}

.opt-image-box img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* 复选框样式 */
.checkbox-indicator {
  margin-left: 12px;
  display: flex;
  align-items: center;
  height: 24px; /* 对齐文字首行 */
}

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color, #cbd5e1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #fff;
}

.option-card.active .checkbox-box {
  background: var(--color-primary, #3b82f6);
  border-color: var(--color-primary, #3b82f6);
}
</style>
