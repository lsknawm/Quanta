<script setup>
defineProps({
  modelValue: String,
  isSubmitted: Boolean,
  correctAnswer: String // 仅用于参考，通常简答题通过解析来核对
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="short-answer-container">
    <el-input
      :model-value="modelValue"
      @input="emit('update:modelValue', $event)"
      type="textarea"
      :rows="4"
      placeholder="请输入你的答案..."
      :disabled="isSubmitted"
      resize="none"
      class="custom-textarea"
    />

    <div v-if="isSubmitted" class="result-box">
      <p class="label">参考答案：</p>
      <div class="value">{{ correctAnswer }}</div>
      <p class="tip">请点击下方“查看解析”核对详细过程。</p>
    </div>
  </div>
</template>

<style scoped>
.custom-textarea { font-size: 1rem; }
:deep(.el-textarea__inner) {
  padding: 16px; border-radius: 12px; border: 2px solid #e5e7eb; box-shadow: none;
}
:deep(.el-textarea__inner:focus) { border-color: #4f46e5; }

.result-box {
  margin-top: 20px; padding: 16px; background: #fffbeb;
  border: 1px solid #fcd34d; border-radius: 8px;
}
.result-box .label { font-size: 0.85rem; color: #b45309; margin: 0 0 4px; font-weight: bold; }
.result-box .value { font-size: 1.1rem; color: #1f2937; font-family: 'SF Mono', monospace; }
.result-box .tip { font-size: 0.8rem; color: #92400e; margin: 8px 0 0; }
</style>
