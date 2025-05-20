import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' //一个状态管理库
import Vant from 'vant' //轻量级且功能丰富的移动端 Vue 组件库
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router' // 全局路由
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //页面刷新时能保留状态

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
