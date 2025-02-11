import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vant from 'vant'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 导入样式
import 'vant/lib/index.css'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(Vant)
app.use(ElementPlus)
app.use(pinia)

app.mount('#app')
document.getElementById('loading').style.display = 'none'
