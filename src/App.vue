<script setup>
import { ref } from 'vue'
import QuestionCard from './components/QuestionCard.vue'

// 使用 String.raw 避免反斜杠转义噩梦
// 或者在普通字符串中必须使用双反斜杠 \\lim, \\to
const questions = ref([
  {
    id: 101,
    type: 'choice',
    category: '高等数学',
    difficulty: 'C',
    // 使用 String.raw`` 哪怕里面有 \t 也不会被转义
    content: String.raw`求极限 $\lim_{x \to 0} \frac{\int_0^x (e^{t^2} - 1) dt}{x^3}$ 的值。`,
    options: [
      String.raw`$1$`,
      String.raw`$\frac{1}{2}$`,
      String.raw`$\frac{1}{3}$`,
      String.raw`$0$`
    ],
    answer: 'C',
    explanation: String.raw`
      本题考察洛必达法则与变上限积分求导。<br><br>
      令 $f(x) = \int_0^x (e^{t^2} - 1) dt$，$g(x) = x^3$。<br>
      当 $x \to 0$ 时，分子分母均为 $0$，属于 $\frac{0}{0}$ 型，使用洛必达法则：<br>
      $$ \lim_{x \to 0} \frac{f'(x)}{g'(x)} = \lim_{x \to 0} \frac{e^{x^2} - 1}{3x^2} $$<br>
      再次使用等价无穷小代换，当 $x \to 0$ 时，$e^{x^2} - 1 \sim x^2$。<br>
      $$ = \lim_{x \to 0} \frac{x^2}{3x^2} = \frac{1}{3} $$
    `
  },
  {
    id: 201,
    type: 'choice',
    category: '线性代数',
    difficulty: 'D',
    content: String.raw`设 $A$ 为 3 阶矩阵，其特征值为 $1, -1, 2$，则 $|A^* + 3E| = ?$`,
    options: [
      '$24$',
      '$30$',
      '$32$',
      '$48$'
    ],
    answer: 'A',
    explanation: String.raw`
      1. 首先求 $A$ 的行列式 $|A|$：<br>
      $|A| = 1 \times (-1) \times 2 = -2$。<br><br>
      2. 利用伴随矩阵性质 $A^* = |A|A^{-1}$... (此处省略后续内容，请确保所有公式反斜杠未被错误转义)
    `
  },
  // ... 其他题目请同理使用 String.raw 处理
  {
    id: 40801,
    type: 'choice',
    category: '408 数据结构',
    difficulty: 'C',
    content: String.raw`若度为 $m$ 的哈夫曼树中，其叶结点个数为 $n$，则非叶结点的个数为？`,
    options: [
      '$n-1$',
      String.raw`$\lfloor \frac{n-1}{m-1} \rfloor$`,
      String.raw`$\lceil \frac{n-1}{m-1} \rceil$`,
      String.raw`$\frac{n-1}{m-1}$`
    ],
    answer: 'C',
    explanation: String.raw`
      公式推导：$n_0 = (m-1)n_k + 1$...
    `
  },
  // 补全剩余题目...
])
</script>

<template>
  <div class="app-container">
    <header class="page-header">
      <div class="header-inner">
        <h1>Quanta 408 & Math</h1>
        <p class="subtitle">Advanced Computer Science & Mathematics Problem Set</p>
      </div>
    </header>

    <main class="quiz-container">
      <QuestionCard
        v-for="(q, index) in questions"
        :key="q.id"
        :question="q"
        :index="index"
      />
    </main>

    <footer class="page-footer">
      <p>Powered by Vue 3 + KaTeX</p>
    </footer>
  </div>
</template>

<style>
/* 保持原有样式，无需更改 */
:root {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
body {
  margin: 0;
  background-color: #fcfcfd;
  color: #1d1d1f;
}
</style>

<style scoped>
/* 保持原有样式 */
.app-container {
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-header {
  padding: 80px 20px 60px;
  text-align: center;
}
.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
}
.subtitle {
  color: #64748b;
  font-size: 1.25rem;
  font-weight: 400;
}
.quiz-container {
  flex: 1;
  padding: 0 20px;
}
.page-footer {
  padding: 60px 0;
  text-align: center;
  color: #cbd5e1;
  font-size: 0.9rem;
}
</style>
