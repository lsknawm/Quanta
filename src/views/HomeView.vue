<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="title">Master Your Knowledge.</h1>
      <p class="subtitle">
        极简主义刷题平台。专注于计算机科学、数学与考研真题。<br>
        无干扰，纯粹的知识验证。
      </p>

      <div class="cta-group">
        <RouterLink to="/exam" class="btn-primary">开始刷题 →</RouterLink>
        <a href="#" class="btn-secondary">查看统计</a>
      </div>

      <div class="features">
        <div class="feature-card">
          <h3>多题型支持</h3>
          <p>单选、多选、填空、简答、完形填空。</p>
        </div>
        <div class="feature-card">
          <h3>可视化解析</h3>
          <p>Python 自动绘图，直观理解复杂概念。</p>
        </div>
        <div class="feature-card">
          <h3>沉浸式体验</h3>
          <p>E-Ink 风格设计，专注阅读与思考。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  background: radial-gradient(circle at 50% 0%, #f9fafb, #fff);
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(180deg, #111, #444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 48px;
  max-width: 600px;
}

.cta-group {
  display: flex;
  gap: 16px;
  margin-bottom: 80px;
}

.btn-primary {
  background: #111;
  color: #fff;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: #fff;
  color: #111;
  border: 1px solid #e5e7eb;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* 响应式调整 */
  gap: 24px;
  max-width: 900px;
  width: 100%;
}

.feature-card {
  padding: 24px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #fff;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111;
}

.feature-card p {
  font-size: 0.9rem;
  color: #666;
}
</style>
