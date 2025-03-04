import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../views/HomePage.vue'
import Community from '../views/Community.vue'
import Profile from '../views/Profile.vue'
import NoBarLayout from '@/layouts/NoBarLayout.vue'
import {check_auth} from "@/util/auth.js";
import ArticleDetail from "@/views/ArticleDetail.vue";
import Test from "@/views/Test.vue";

// 路由守卫 跳转页面鉴权
const routes = [
  {
    path: '/',
    redirect: '/home',
    component: NoBarLayout,
    children: [
      {
        path: 'login',
        name: 'LoginPage',
        component: LoginPage,
      },
      {
        path: 'article_detail',
        name: 'ArticleDetail',
        component: ArticleDetail,
      }
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
      {
        path: 'test',
        name: 'Test',
        component: Test
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
  // 页面鉴权跳转 + 有cookie token自动登录
  // 不可以有 to.path === '/login' 的判断做自动登录，会进入页面跳转的无限循环。页面渲染显示白色。
  console.log('to.meta.requiresAuth', to.meta.requiresAuth,to.path)
  if (to.meta.requiresAuth) {
    check_auth().then((res) => {
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


