<script setup>
import { ref } from 'vue'
import QuestionCard from '../components/QuestionCard.vue'
import SingleChoice from '../components/questions/SingleChoice.vue'

// 模拟数据 (符合 interface.http)
const mockData = {
  id: "Q_DEMO_01",
  type: "single_choice",
  meta: {
    difficulty: "B",
    score: 5,
    type: "single_choice" // 这里冗余存一下方便传递，或者直接传外层的type
  },
  content: {
    text: "在 Vue 3 Composition API 中，用于创建一个响应式引用对象的方法是？",
    has_image: false
  },
  structure: {
    options: [
      { id: "OPT_A", text: "reactive()" },
      { id: "OPT_B", text: "ref()" },
      { id: "OPT_C", text: "computed()" },
      { id: "OPT_D", text: "watchEffect()" }
    ]
  }
}

// 用户答案状态
const userAnswer = ref('')
</script>

<template>
  <div class="preview-stage">

    <div class="stage-header">
      <router-link to="/" class="back-link">← Back to Home</router-link>
      <h2>Component Preview</h2>
    </div>

    <div class="demo-area">

      <QuestionCard
        :index="0"
        :meta="mockData.meta"
      >
        <SingleChoice
          :question="mockData"
          v-model="userAnswer"
        />
      </QuestionCard>

    </div>

    <div class="debug-info">
      Selected Answer ID: <span>{{ userAnswer || 'None' }}</span>
    </div>

  </div>
</template>

<style scoped>
.preview-stage {
  min-height: 100vh;
  background-color: #F8FAFC;
  padding: 40px;
  font-family: 'Inter', sans-serif;
}

.stage-header {
  max-width: 800px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  color: #64748B;
  text-decoration: none;
  font-weight: 500;
}
.back-link:hover { color: #3B82F6; }

.demo-area {
  max-width: 800px;
  margin: 0 auto;
}

.debug-info {
  max-width: 800px;
  margin: 20px auto;
  text-align: right;
  color: #94A3B8;
  font-family: monospace;
}
.debug-info span {
  color: #3B82F6;
  font-weight: bold;
}
</style>
