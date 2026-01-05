<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const wordCount = computed(() => {
  return props.modelValue.length
})
</script>

<template>
  <div class="short-answer-wrapper">
    <div class="question-stem">
      <span class="type-tag">简答</span>
      {{ question.content.text }}
    </div>

    <div class="input-area">
      <textarea
        class="sa-textarea"
        :value="modelValue"
        @input="handleInput"
        placeholder="请输入你的答案..."
        rows="6"
      ></textarea>

      <div class="footer-info">
        <span class="hint">支持 Markdown 格式</span>
        <span class="count" :class="{ 'limit-near': wordCount > 500 }">
          {{ wordCount }} 字
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-stem {
  font-size: 1.1rem;
  font-weight: 500;
  color: #18181B;
  margin-bottom: 24px;
  line-height: 1.6;
}
.type-tag {
  display: inline-block;
  font-size: 0.75rem;
  background: #8B5CF6; /* Purple for Short Answer */
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: middle;
  margin-right: 8px;
  transform: translateY(-1px);
}

.input-area {
  position: relative;
}

.sa-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  font-size: 1rem;
  color: #334155;
  outline: none;
  resize: vertical;
  transition: all 0.2s;
  background: #FAFAFA;
  font-family: inherit;
  line-height: 1.6;
}

.sa-textarea:focus {
  background: #fff;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.footer-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #94A3B8;
}

.count.limit-near {
  color: #EF4444;
}
</style>
