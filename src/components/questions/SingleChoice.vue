<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const handleSelect = (optionId) => {
  emit('update:modelValue', optionId)
}
</script>

<template>
  <div class="single-choice">
    <div class="stem">
      {{ question.content.text }}
    </div>

    <div class="options-group">
      <div
        v-for="opt in question.structure.options"
        :key="opt.id"
        class="option-card"
        :class="{ active: modelValue === opt.id }"
        @click="handleSelect(opt.id)"
      >
        <div class="opt-key">{{ opt.id.split('_').pop() }}</div>
        <div class="opt-content">{{ opt.text }}</div>

        <div class="radio-indicator"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stem {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 24px;
  line-height: 1.6;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  background-color: var(--bg-surface);
  transition: all 0.2s ease;
}

.option-card:hover {
  background-color: var(--bg-surface-alt);
  border-color: var(--border-hover);
}

.option-card.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.opt-key {
  width: 28px;
  height: 28px;
  background: var(--bg-input);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 16px;
  transition: all 0.2s;
}

.option-card.active .opt-key {
  background: var(--color-primary);
  color: white;
}

.opt-content {
  flex: 1;
  font-size: 1rem;
  color: var(--text-regular);
}
.option-card.active .opt-content {
  color: var(--color-primary-hover);
  font-weight: 500;
}

/* Radio UI */
.radio-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-hover);
  position: relative;
  transition: all 0.2s;
}

.option-card.active .radio-indicator {
  border-color: var(--color-primary);
}

.option-card.active .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
}
</style>
