import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../views/HomePage.vue'
import Community from '../views/Community.vue'
import Profile from '../views/Profile.vue'
import NoBarLayout from '@/layouts/NoBarLayout.vue'
import { auth_check } from '@/api/login'

// 路由守卫 跳转页面鉴权
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/',
    component: NoBarLayout,
    children: [
      {
        path: 'login',
        name: 'LoginPage',
        component: LoginPage,
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'home',
        name: 'HomePage',
        component: HomePage,
      },
      {
        path: 'community',
        name: 'Community',
        component: Community,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth() // 检查用户是否已登录
  console.log('to.meta.requiresAuth', to.meta.requiresAuth)
  console.log('isAuthenticated', isAuthenticated)
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果需要鉴权且用户未登录，重定向到登录页面
    next('/login')
  } else {
    // 否则，继续导航
    next()
  }
})

// 检查用户是否已登录的函数
function checkAuth() {
  // 获取 token 和 user-id
  // const token = getCookie('token')
  // const userId = getCookie('user-id')

  auth_check().then((res) => {
    console.log(res)
    if (res.data.code === 0) return true
  })
  return false
}

// 获取 token 和 user-id 的值
// function getCookie(name) {
//   const cookieString = document.cookie
//   const cookies = cookieString.split('; ').reduce((acc, cookie) => {
//     const [key, value] = cookie.split('=')
//     acc[key] = decodeURIComponent(value)
//     return acc
//   }, {})
//   return cookies[name]
// }
