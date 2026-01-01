<script setup>
import { Check, Close } from '@element-plus/icons-vue'

defineProps({
  modelValue: String,
  isSubmitted: Boolean,
  correctAnswer: String,
  // 新增：接收父组件传下来的自判状态 (null, true, false)
  selfCorrectStatus: {
    type: [Boolean, Object], // Object for null
    default: null
  }
})

// 新增：抛出事件给父组件
const emit = defineEmits(['update:modelValue', 'toggle-correct'])
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

      <div class="self-check-area">
        <p class="check-tip">请对比参考答案，并标记你的回答是否正确：</p>
        <div class="check-actions">
          <el-button
            :type="selfCorrectStatus === true ? 'success' : 'default'"
            :plain="selfCorrectStatus !== true"
            @click="emit('toggle-correct', true)"
          >
            <el-icon class="el-icon--left"><Check /></el-icon> 我答对了
          </el-button>

          <el-button
            :type="selfCorrectStatus === false ? 'danger' : 'default'"
            :plain="selfCorrectStatus !== false"
            @click="emit('toggle-correct', false)"
          >
            <el-icon class="el-icon--left"><Close /></el-icon> 我答错了
          </el-button>
        </div>
      </div>

      <el-divider style="margin: 16px 0;" />

      <p class="label">参考答案：</p>
      <div class="value">{{ correctAnswer }}</div>
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

/* 新增样式 */
.check-tip { font-size: 0.9rem; color: #92400e; margin-bottom: 12px; font-weight: 500; }
.check-actions { display: flex; gap: 12px; }
</style>
