<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  modelValue: { type: Array, default: () => [] } // 多选的值是数组
})

const emit = defineEmits(['update:modelValue'])

const toggleOption = (optionId) => {
  const currentVal = [...props.modelValue]
  const idx = currentVal.indexOf(optionId)

  if (idx > -1) {
    currentVal.splice(idx, 1) // 取消选中
  } else {
    currentVal.push(optionId) // 选中
  }

  emit('update:modelValue', currentVal)
}
</script>

<template>
  <div class="multiple-choice-wrapper">
    <div class="question-stem">
      <span class="type-tag">多选</span>
      {{ question.content.text }}
    </div>

    <div class="options-list">
      <div
        v-for="opt in question.structure.options"
        :key="opt.id"
        class="option-item"
        :class="{ active: modelValue.includes(opt.id) }"
        @click="toggleOption(opt.id)"
      >
        <div class="checkbox-indicator">
          <div class="check-mark" v-if="modelValue.includes(opt.id)">✓</div>
        </div>

        <div class="opt-key">{{ opt.id.split('_').pop() }}</div>
        <div class="opt-text">{{ opt.text }}</div>
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
  background: #3B82F6;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: middle;
  margin-right: 8px;
  transform: translateY(-1px);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s;
}

.option-item:hover { border-color: #A1A1AA; background: #FAFAFA; }

.option-item.active {
  border-color: #3B82F6;
  background-color: #EFF6FF;
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

/* Checkbox UI */
.checkbox-indicator {
  width: 22px;
  height: 22px;
  border: 2px solid #D4D4D8;
  border-radius: 6px; /* 方形圆角 */
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.option-item.active .checkbox-indicator {
  background: #3B82F6;
  border-color: #3B82F6;
}

.check-mark {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.opt-key {
  font-size: 0.9rem;
  color: #71717A;
  margin-right: 12px;
  font-weight: 600;
}
.opt-text { font-size: 1rem; color: #3F3F46; }
</style>
