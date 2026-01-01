<script setup>
import { computed } from 'vue'
import { Check } from '@element-plus/icons-vue'

const props = defineProps({
  question: Object,
  modelValue: { type: Array, default: () => [] }, // 这是一个索引数组，如 [0, 2]
  isSubmitted: Boolean,
  correctIndices: Array // 正确答案的索引数组
})

const emit = defineEmits(['update:modelValue'])

const handleClick = (idx) => {
  if (props.isSubmitted) return
  const newVal = [...props.modelValue]
  const pos = newVal.indexOf(idx)
  if (pos === -1) {
    newVal.push(idx)
  } else {
    newVal.splice(pos, 1)
  }
  emit('update:modelValue', newVal)
}

// 辅助判断某个选项是否被选中
const isSelected = (idx) => props.modelValue.includes(idx)
// 辅助判断某个选项是否是正确答案
const isCorrect = (idx) => props.correctIndices.includes(idx)
</script>

<template>
  <div class="options-list">
    <div
      v-for="(option, idx) in question.options"
      :key="idx"
      class="option-item"
      :class="{
        'is-selected': isSelected(idx) && !isSubmitted,
        // 提交后：是正确答案，显示绿色
        'is-correct-highlight': isSubmitted && isCorrect(idx),
        // 提交后：选了但是错的，显示红色
        'is-wrong-highlight': isSubmitted && isSelected(idx) && !isCorrect(idx),
        // 提交后：漏选的（是正确答案但没选），给个黄色边框提示
        'is-missed': isSubmitted && !isSelected(idx) && isCorrect(idx),
        'is-disabled': isSubmitted
      }"
      @click="handleClick(idx)"
    >
      <div class="option-marker checkbox-marker">
        <el-icon v-if="isSelected(idx) || (isSubmitted && isCorrect(idx))"><Check /></el-icon>
        <span v-else>{{ String.fromCharCode(65 + idx) }}</span>
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
/* 这里大部分复用单选样式，除了 Marker 是方块 */
.options-list { display: flex; flex-direction: column; gap: 12px; }
.option-item {
  display: flex; align-items: flex-start; padding: 16px 20px;
  border: 2px solid #e5e7eb; border-radius: 12px;
  cursor: pointer; transition: all 0.2s; background: #fff;
}
.option-item:hover:not(.is-disabled) { border-color: #c7d2fe; background-color: #f9fafb; }

.checkbox-marker {
  width: 32px; height: 32px; border-radius: 6px; /* 方块圆角 */
  background: #f3f4f6; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  margin-right: 16px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
}

.option-item.is-selected { border-color: #4f46e5; background-color: #eef2ff; }
.option-item.is-selected .checkbox-marker { background: #4f46e5; color: #fff; }

/* 结果状态颜色 */
.option-item.is-correct-highlight { border-color: #10b981; background-color: #ecfdf5; }
.option-item.is-correct-highlight .checkbox-marker { background: #10b981; color: #fff; }

.option-item.is-wrong-highlight { border-color: #ef4444; background-color: #fef2f2; }
.option-item.is-wrong-highlight .checkbox-marker { background: #ef4444; color: #fff; }

.option-item.is-missed { border-color: #f59e0b; border-style: dashed; } /* 漏选样式 */

.option-body { flex: 1; }
.option-text { font-size: 1rem; color: #374151; line-height: 1.6; }
.option-image-wrapper { margin-top: 8px; }
.option-image { max-width: 150px; border-radius: 4px; border: 1px solid #eee; }
</style>
