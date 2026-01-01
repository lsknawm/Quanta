import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入 Katex 样式（如果 index.html 中没有通过 CDN 引入，则需要在这里引入）
import 'katex/dist/katex.min.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
