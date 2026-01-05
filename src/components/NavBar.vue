<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <RouterLink to="/" class="brand">
        <span class="logo-text">Boson.</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-item">首页</RouterLink>
        <a href="https://github.com/your-repo" target="_blank" class="nav-item">GitHub</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: 64px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-content {
  max-width: 1000px; /* 与 HomeView/ExamView 宽度对齐 */
  margin: 0 auto;
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.05em;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-item {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--color-primary);
}

.router-link-active {
  color: var(--text-main);
  font-weight: 600;
}
</style>
