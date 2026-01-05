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
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="short-answer">
    <div class="answer-box">
      <textarea
        class="custom-textarea"
        rows="8"
        placeholder="在此处输入您的回答..."
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>

      <div class="word-count" v-if="modelValue">
        已输入 {{ modelValue.length }} 字
      </div>
    </div>
  </div>
</template>

<style scoped>
.short-answer {
  margin-top: 10px;
}

.answer-box {
  position: relative;
}

.custom-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical; /* 允许垂直拉伸 */
  outline: none;
  background: var(--bg-surface, #fff);
  font-family: inherit;
  transition: all 0.2s;
}

.custom-textarea:focus {
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 3px var(--color-primary-focus, rgba(59, 130, 246, 0.1));
}

.word-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 0.8rem;
  color: var(--text-placeholder, #94a3b8);
  pointer-events: none;
}
</style>
