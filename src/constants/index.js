// src/constants/index.js

// 引入 Element Plus 图标 (如果需要动态渲染图标)
import {
  DataBoard,
  TrendCharts,
  Medal,
  Trophy,
  Check,
  EditPen,
  ChatDotSquare,
  Finished
} from '@element-plus/icons-vue'

/**
 * 难度映射表
 * value: 后端存储的值
 * color: 对应 main.css 中的变量
 */
export const DIFFICULTY_MAP = {
  A: {
    value: 'A',
    label: '新手',
    sub: 'Basic',
    color: 'var(--color-success)', // 对应 Emerald
    bg: 'var(--color-success-bg)',
    desc: '基础概念巩固',
    icon: DataBoard
  },
  B: {
    value: 'B',
    label: '进阶',
    sub: 'Advanced',
    color: 'var(--color-info)',    // 对应 Blue
    bg: 'var(--color-info-bg)',
    desc: '核心知识应用',
    icon: TrendCharts
  },
  C: {
    value: 'C',
    label: '挑战',
    sub: 'Expert',
    color: 'var(--color-warning)', // 对应 Amber
    bg: 'var(--color-warning-bg)',
    desc: '复杂场景分析',
    icon: Medal
  },
  D: {
    value: 'D',
    label: '噩梦',
    sub: 'Master',
    color: 'var(--color-danger)',  // 对应 Red
    bg: 'var(--color-danger-bg)',
    desc: '极限边界情况',
    icon: Trophy
  }
}

/**
 * 题型枚举
 * 用于转换后端 type 字段为中文显示
 */
export const QUESTION_TYPES = {
  single_choice: { label: '单选题', icon: Finished, color: 'var(--color-info)' },
  multiple_choice: { label: '多选题', icon: Finished, color: 'var(--color-primary)' },
  true_false: { label: '判断题', icon: Check, color: 'var(--color-success)' },
  short_answer: { label: '简答题', icon: ChatDotSquare, color: 'var(--color-purple)' },
  fill_blank: { label: '填空题', icon: EditPen, color: 'var(--color-warning)' }
}

/**
 * 默认分页/题量配置
 */
export const DEFAULT_LIMIT_PRESETS = [5, 10, 15, 20, 50]
