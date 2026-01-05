// src/stores/exam.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import quizApi from '../api/quiz';

export const useExamStore = defineStore('exam', () => {
  // --- State (状态) ---
  const questions = ref([]);        // 题目列表
  const userAnswers = ref({});      // 用户答案映射 { "Q1": "OPT_A", "Q2": ["A","B"] }
  const validationResults = ref({}); // 判题结果映射 { "Q1": { correct: true, explanation: "..." } }

  const currentIndex = ref(0);      // 当前题号
  const isLoading = ref(false);     // 加载中
  const error = ref(null);          // 错误信息

  // --- Getters (计算属性) ---
  const currentQuestion = computed(() => {
    if (!questions.value.length) return null;
    return questions.value[currentIndex.value];
  });

  const progressPercentage = computed(() => {
    if (!questions.value.length) return 0;
    return ((currentIndex.value + 1) / questions.value.length) * 100;
  });

  const isLastQuestion = computed(() => {
    return questions.value.length > 0 && currentIndex.value === questions.value.length - 1;
  });

  const isFirstQuestion = computed(() => currentIndex.value === 0);

  // --- Actions (动作) ---

  // 初始化考试：从后端拉取题目
  async function initExam(params) {
    isLoading.value = true;
    error.value = null;
    // 重置状态
    questions.value = [];
    userAnswers.value = {};
    validationResults.value = {};
    currentIndex.value = 0;

    try {
      // params 包含 subject, difficulty, count
      // 注意：根据 interface.http，后端返回的是一个数组，还是 { data: [] }？
      // 假设 interface.http 中 POST /quiz/generate 直接返回题目数组 json (List<Question>)
      // 如果后端包了一层 { code: 200, data: [...] }，请在这里调整取值逻辑
      const data = await quizApi.generateQuiz(params);

      // 容错处理：确保 data 是数组
      if (Array.isArray(data)) {
        questions.value = data;
      } else if (data.questions) {
        // 某些后端可能返回 { questions: [...] }
        questions.value = data.questions;
      } else {
        throw new Error("Invalid response format");
      }

    } catch (err) {
      error.value = "无法生成试卷，请检查网络或稍后重试。";
    } finally {
      isLoading.value = false;
    }
  }

  // 记录用户作答 (本地暂存)
  function setAnswer(questionId, answer) {
    userAnswers.value[questionId] = answer;
  }

  // 提交单题判分 (可选：如果要做即时反馈)
  async function checkCurrentAnswer() {
    const q = currentQuestion.value;
    const ans = userAnswers.value[q.id];

    if (!ans) return; // 未作答不校验

    try {
      const result = await quizApi.validateAnswer(q.id, ans);
      validationResults.value[q.id] = result;
      return result; // 返回给前端 UI 用于展示弹窗或颜色
    } catch (err) {
      console.error("Validation failed", err);
    }
  }

  // 导航
  function nextQuestion() {
    if (!isLastQuestion.value) currentIndex.value++;
  }

  function prevQuestion() {
    if (!isFirstQuestion.value) currentIndex.value--;
  }

  return {
    questions,
    userAnswers,
    validationResults,
    currentIndex,
    isLoading,
    error,
    currentQuestion,
    progressPercentage,
    isLastQuestion,
    isFirstQuestion,
    initExam,
    setAnswer,
    checkCurrentAnswer,
    nextQuestion,
    prevQuestion
  };
});
