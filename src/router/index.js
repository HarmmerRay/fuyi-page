import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../views/HomePage.vue'
import Community from '../views/Community.vue'
import Profile from '../views/Profile.vue'
import NoBarLayout from '@/layouts/NoBarLayout.vue'
import { auth_check } from '@/api/login'
import {ref} from "vue";

// 路由守卫 跳转页面鉴权
const routes = [
  {
    path: '/',
    redirect: '/login',
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
  console.log('to.meta.requiresAuth', to.meta.requiresAuth,to.path)
  // console.log(to.path)
  if (to.meta.requiresAuth) {
    checkAuth().then((res) => {
      console.log('res:',res,to.path)
      if (res){
        next()
      }else{
        console.log("next(/login)",to.path)
        next('/login')
      }
    })// 检查用户是否已登录
  } else {
    next()
  }
})

// 检查用户是否已登录的函数
function checkAuth() {
  // 获取 token 和 user-id
  const token = getCookie('token')
  // console.log(token)
  return auth_check().then((res) => {
    return res.data.code === '0';
  })
}
// 获取 token 和 user-id 的值
export function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
