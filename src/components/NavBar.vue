<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-icon">Q</span>
        <span class="logo-text">Quanta</span>
      </div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-item" active-class="active">主页</RouterLink>
        <RouterLink to="/exam" class="nav-item" active-class="active">刷题模式</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px); /* 毛玻璃效果 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  height: 64px;
  display: flex;
  align-items: center;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #111;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}

.logo-icon {
  background: #000;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #000;
  background-color: rgba(0,0,0,0.03);
}

.nav-item.active {
  color: #000;
  font-weight: 600;
}
</style>
