<script setup>
defineProps({
  // 接收完整的题目对象
  question: {
    type: Object,
    required: true
  },
  // 双向绑定用户的答案
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
  <div class="single-choice-wrapper">

    <div class="question-stem">
      {{ question.content.text }}
    </div>

    <div class="options-list">
      <div
        v-for="opt in question.structure.options"
        :key="opt.id"
        class="option-item"
        :class="{ active: modelValue === opt.id }"
        @click="handleSelect(opt.id)"
      >
        <div class="opt-key">{{ opt.id.split('_').pop() }}</div> <div class="opt-text">{{ opt.text }}</div>

        <div class="radio-indicator"></div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.question-stem {
  font-size: 1.1rem;
  font-weight: 500;
  color: #18181B; /* Zinc 900 */
  margin-bottom: 24px;
  line-height: 1.6;
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
  border: 1px solid #E4E4E7; /* Zinc 200 */
  border-radius: 12px;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.option-item:hover {
  background-color: #FAFAFA;
  border-color: #D4D4D8;
}

.option-item.active {
  border-color: #3B82F6; /* Blue 500 */
  background-color: #EFF6FF; /* Blue 50 */
  box-shadow: 0 0 0 1px #3B82F6 inset;
}

.opt-key {
  width: 28px;
  height: 28px;
  background: #F4F4F5;
  color: #71717A;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 16px;
  transition: all 0.2s;
}

.option-item.active .opt-key {
  background: #3B82F6;
  color: white;
}

.opt-text {
  flex: 1;
  font-size: 1rem;
  color: #3F3F46;
}
.option-item.active .opt-text {
  color: #18181B;
  font-weight: 500;
}

/* Radio Circle UI */
.radio-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #D4D4D8;
  position: relative;
}
.option-item.active .radio-indicator {
  border-color: #3B82F6;
}
.option-item.active .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px;
  background: #3B82F6;
  border-radius: 50%;
}
</style>
