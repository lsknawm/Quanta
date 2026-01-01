<script setup>
import { Check, CircleCheck, CircleClose } from '@element-plus/icons-vue'

// 1. 接收 props 对象
const props = defineProps({
  question: Object,
  modelValue: Number, // 用户选中的索引
  isSubmitted: Boolean,
  correctIndex: Number
})

const emit = defineEmits(['update:modelValue'])

const handleClick = (idx) => {
  // 2. 修复点：必须使用 props.isSubmitted
  if (!props.isSubmitted) {
    emit('update:modelValue', idx)
  }
}
</script>

<template>
  <div class="options-list">
    <div
      v-for="(option, idx) in question.options"
      :key="idx"
      class="option-item"
      :class="{
        'is-selected': modelValue === idx && !isSubmitted,
        'is-correct-highlight': isSubmitted && idx === correctIndex,
        'is-wrong-highlight': isSubmitted && modelValue === idx && idx !== correctIndex,
        'is-disabled': isSubmitted
      }"
      @click="handleClick(idx)"
    >
      <div class="option-marker">
        <template v-if="isSubmitted">
          <el-icon v-if="idx === correctIndex"><CircleCheck /></el-icon>
          <el-icon v-else-if="modelValue === idx"><CircleClose /></el-icon>
          <span v-else>{{ String.fromCharCode(65 + idx) }}</span>
        </template>
        <template v-else>
          <el-icon v-if="modelValue === idx"><Check /></el-icon>
          <span v-else>{{ String.fromCharCode(65 + idx) }}</span>
        </template>
      </div>

      <div class="option-body">
        <div class="option-text" v-html="option.text"></div>
        <div v-if="option.option_image" class="option-image-wrapper">
          <img :src="option.option_image" class="option-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.options-list { display: flex; flex-direction: column; gap: 12px; }
.option-item {
  display: flex; align-items: flex-start; padding: 16px 20px;
  border: 2px solid #e5e7eb; border-radius: 12px;
  cursor: pointer; transition: all 0.2s; background: #fff;
}
.option-item:hover:not(.is-disabled) { border-color: #c7d2fe; background-color: #f9fafb; }
.option-item.is-disabled { cursor: default; }
.option-item.is-selected { border-color: #4f46e5; background-color: #eef2ff; box-shadow: 0 0 0 1px #4f46e5; }
.option-item.is-selected .option-marker { background: #4f46e5; color: #fff; }
.option-item.is-correct-highlight { border-color: #10b981; background-color: #ecfdf5; box-shadow: 0 0 0 1px #10b981; }
.option-item.is-correct-highlight .option-marker { background-color: #10b981; color: #fff; }
.option-item.is-wrong-highlight { border-color: #ef4444; background-color: #fef2f2; box-shadow: 0 0 0 1px #ef4444; opacity: 0.8; }
.option-item.is-wrong-highlight .option-marker { background-color: #ef4444; color: #fff; }

.option-marker {
  width: 32px; height: 32px; border-radius: 50%;
  background: #f3f4f6; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  margin-right: 16px; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
  margin-top: 2px;
}
.option-body { flex: 1; }
.option-text { font-size: 1rem; color: #374151; line-height: 1.6; }
.option-image-wrapper { margin-top: 8px; }
.option-image { max-width: 150px; border-radius: 4px; border: 1px solid #eee; }
</style>
