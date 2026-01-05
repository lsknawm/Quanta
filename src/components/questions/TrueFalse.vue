<script setup>
import { Check, Close } from '@element-plus/icons-vue'
defineProps({
  question: { type: Object, required: true },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const handleSelect = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="true-false-wrapper">
    <div class="question-stem">
      {{ question.content.text }}
    </div>

    <div class="tf-options">
      <button
        class="tf-btn true-btn"
        :class="{ active: modelValue === 'OPT_TRUE' }"
        @click="handleSelect('OPT_TRUE')"
      >
        <div class="icon-circle"><el-icon><Check /></el-icon></div>
        <span>正确 / True</span>
      </button>

      <button
        class="tf-btn false-btn"
        :class="{ active: modelValue === 'OPT_FALSE' }"
        @click="handleSelect('OPT_FALSE')"
      >
        <div class="icon-circle"><el-icon><Close /></el-icon></div>
        <span>错误 / False</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-stem {
  font-size: 1.15rem;
  font-weight: 500;
  color: #18181B;
  margin-bottom: 32px;
}

.tf-options {
  display: flex;
  gap: 20px;
}

.tf-btn {
  flex: 1;
  padding: 30px;
  border: 2px solid #E4E4E7;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.tf-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F4F4F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s;
}

/* True Style */
.true-btn:hover { border-color: #10B981; }
.true-btn.active {
  background: #ECFDF5;
  border-color: #10B981;
  color: #065F46;
}
.true-btn.active .icon-circle {
  background: #10B981;
  color: white;
}

/* False Style */
.false-btn:hover { border-color: #EF4444; }
.false-btn.active {
  background: #FEF2F2;
  border-color: #EF4444;
  color: #991B1B;
}
.false-btn.active .icon-circle {
  background: #EF4444;
  color: white;
}

@media (max-width: 600px) {
  .tf-options { flex-direction: column; }
}
</style>
