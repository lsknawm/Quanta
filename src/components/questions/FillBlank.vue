<script setup>
import { EditPen } from '@element-plus/icons-vue'
defineProps({
  question: { type: Object, required: true },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="fill-blank-wrapper">
    <div class="question-stem">
      <span class="type-tag">填空</span>
      {{ question.content.text }}
    </div>

    <div class="answer-field">
      <div class="field-label">
        <el-icon><EditPen /></el-icon> 填写答案：
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          class="fb-input"
          :value="modelValue"
          @input="handleInput"
          placeholder="在此处键入答案..."
        />
        <div class="input-line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-stem {
  font-size: 1.15rem;
  font-weight: 500;
  color: #18181B;
  margin-bottom: 32px;
  line-height: 1.8;
}
.type-tag {
  display: inline-block;
  font-size: 0.75rem;
  background: #10B981; /* Emerald for Fill Blank */
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: middle;
  margin-right: 8px;
  transform: translateY(-1px);
}

.answer-field {
  background: #F8FAFC;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-wrapper {
  position: relative;
}

.fb-input {
  width: 100%;
  padding: 12px 0;
  font-size: 1.1rem;
  color: #1E293B;
  border: none;
  background: transparent;
  border-bottom: 2px solid #CBD5E1;
  outline: none;
  transition: all 0.3s;
  font-weight: 500;
}

.fb-input:focus {
  border-bottom-color: #10B981;
}

.fb-input::placeholder {
  color: #CBD5E1;
  font-weight: 400;
}
</style>
