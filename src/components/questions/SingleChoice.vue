<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

// 生成 A, B, C, D 序号
const getIndexLabel = (index) => {
  return String.fromCharCode(65 + index) // 0->A, 1->B ...
}

// 选中逻辑
const handleSelect = (id) => {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="single-choice">
    <div class="options-list">
      <div
        v-for="(opt, index) in question.structure.options"
        :key="opt.id"
        class="option-card"
        :class="{ active: modelValue === opt.id }"
        @click="handleSelect(opt.id)"
      >
        <div class="opt-label">{{ getIndexLabel(index) }}</div>

        <div class="opt-content">
          <div class="opt-text">{{ opt.text }}</div>

          <div v-if="opt.has_image" class="opt-image-box">
            <img :src="opt.image" alt="Option Image" loading="lazy" />
          </div>
        </div>

        <div class="selection-mark" v-if="modelValue === opt.id">
          <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-card {
  display: flex;
  align-items: flex-start; /* 顶部对齐，适应多行文本 */
  padding: 16px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-surface, #fff);
  position: relative;
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

.selection-mark {
  color: var(--color-primary, #3b82f6);
  margin-left: 12px;
  display: flex;
  align-items: center;
}
</style>
