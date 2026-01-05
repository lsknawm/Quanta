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

const handleSelect = (id) => {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="true-false-container">
    <div class="tf-grid">
      <div
        v-for="opt in question.structure.options"
        :key="opt.id"
        class="tf-card"
        :class="{
          active: modelValue === opt.id,
          'is-true': opt.id.includes('TRUE') || opt.text === '正确',
          'is-false': opt.id.includes('FALSE') || opt.text === '错误'
        }"
        @click="handleSelect(opt.id)"
      >
        <div class="icon-box">
          <span v-if="opt.id.includes('TRUE') || opt.text === '正确'" class="icon">✓</span>
          <span v-else class="icon">✕</span>
        </div>

        <span class="tf-text">{{ opt.text }}</span>

        <img v-if="opt.has_image" :src="opt.image" class="tf-img" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.true-false-container {
  margin-top: 20px;
}

.tf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 左右两栏布局 */
  gap: 24px;
}

@media (max-width: 600px) {
  .tf-grid {
    grid-template-columns: 1fr; /* 手机端改为上下布局 */
  }
}

.tf-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 16px;
  cursor: pointer;
  background: var(--bg-surface, #fff);
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  gap: 16px;
}

.tf-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--border-hover, #cbd5e1);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-surface-alt, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-secondary, #94a3b8);
  transition: all 0.2s;
}

.tf-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-main, #334155);
}

/* 选中样式 */
.tf-card.active {
  border-color: var(--color-primary, #3b82f6);
  background-color: var( #eff6ff);
}
.tf-card.active .icon-box {
  background-color: var(--color-primary, #3b82f6);
  color: #fff;
}
.tf-card.active .tf-text {
  color: var(--color-primary, #3b82f6);
}

/* (可选) 为正确/错误选项添加特定颜色倾向，如果你喜欢的话 */
/* .tf-card.is-true:hover { border-color: #10b981; }
.tf-card.is-true.active { border-color: #10b981; background-color: #ecfdf5; }
.tf-card.is-true.active .icon-box { background-color: #10b981; }
.tf-card.is-true.active .tf-text { color: #059669; }

.tf-card.is-false:hover { border-color: #ef4444; }
.tf-card.is-false.active { border-color: #ef4444; background-color: #fef2f2; }
.tf-card.is-false.active .icon-box { background-color: #ef4444; }
.tf-card.is-false.active .tf-text { color: #dc2626; }
*/
</style>
