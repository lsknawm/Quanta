<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const updateBlank = (blankId, value) => {
  // 更新特定填空项的值，保留其他项
  const newAnswers = {
    ...props.modelValue,
    [blankId]: value
  }
  emit('update:modelValue', newAnswers)
}
</script>

<template>
  <div class="fill-blank">
    <div class="question-text-display">
      {{ question.content.text }}
    </div>

    <div class="blanks-container">
      <div
        v-for="(blank, index) in question.structure.blanks"
        :key="blank.id"
        class="blank-item"
      >
        <label class="blank-label">
          填空 {{ index + 1 }}
        </label>

        <div class="input-wrapper">
          <input
            type="text"
            class="custom-input"
            :placeholder="blank.placeholder || '请输入答案'"
            :value="modelValue[blank.id] || ''"
            @input="updateBlank(blank.id, $event.target.value)"
          />
          <div class="focus-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fill-blank {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-text-display {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-main, #334155);
  padding: 16px;
  background: var(--bg-surface-alt, #f8fafc);
  border-radius: 8px;
  border-left: 4px solid var(--color-primary, #3b82f6);
}

.blanks-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blank-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.blank-label {
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  min-width: 60px;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.custom-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background: var(--bg-surface, #fff);
  transition: border-color 0.2s;
}

.custom-input:focus {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 3px var(--color-primary-focus, rgba(59, 130, 246, 0.1));
}
</style>
