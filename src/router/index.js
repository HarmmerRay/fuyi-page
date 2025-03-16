import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../views/HomePage.vue'
import Community from '../views/Community.vue'
import Profile from '../views/Profile.vue'
import NoBarLayout from '@/layouts/NoBarLayout.vue'
import {check_auth} from "@/util/auth.js";
import ArticleDetail from "@/views/ArticleDetail.vue";
import Test from "@/views/Test.vue";
import AddReminders from "@/views/AddReminders.vue";
import ModifyReminders from "@/views/ModifyReminders.vue";
import ModifyProfile from "@/views/ModifyProfile.vue";
import TopBarLayout from "@/layouts/TopBarLayout.vue";
import MessageCenter from "@/views/MessageCenter.vue";
import HelpCenter from "@/views/HelpCenter.vue";
import TixingItems from "@/views/TixingItems.vue";
import ContactUs from "@/views/ContactUs.vue";
import MessageDetail from "@/views/MessageDetail.vue";

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
      },
      {
        path: 'add_reminders',
        name: 'AddReminders',
        component: AddReminders,
      },
      {
        path: 'modify_reminders/:id',
        name: 'ModifyReminders',
        component: ModifyReminders,
        props: router => ({id: router.params.id})
      },
      {
        path: 'modify_profile/:id',
        name: 'ModifyProfile',
        component: ModifyProfile,
        props: router => ({id: router.params.id})
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
        meta: {requiresAuth: true},
      },
      {
        path: 'test',
        name: 'Test',
        component: Test
      },
    ],
  },
  {
    path: '/',
    component: TopBarLayout,
    children: [
      {
        path: 'message_center',
        name: 'MessageCenter',
        component: MessageCenter,
        meta: {
          title: '消息中心'
        }
      },
      {
        path: 'message_detail/:id',
        name: 'MessageDetail',
        component: MessageDetail,
        meta: {
          title: '消息详细'
        },
        props: router => ({id: router.params.id})
      },
      {
        path: 'help_center',
        name: 'HelpCenter',
        component: HelpCenter,
        meta: {
          title: '帮助中心'
        }
      },
      {
        path: 'tixing_items',
        name: 'TixingItems',
        component: TixingItems,
        meta: {
          title: '提醒事项'
        }
      },
      {
        path: 'contact_us',
        name: 'ContactUs',
        component: ContactUs,
        meta: {
          title: '联系我们'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
router.beforeEach((to, from, next) => {
  // 页面鉴权跳转 + 有cookie token自动登录
  // 不可以有 to.path === '/login' 的判断做自动登录，会进入页面跳转的无限循环。页面渲染显示白色。
  console.log('to.meta.requiresAuth', to.meta.requiresAuth, to.path)
  if (to.meta.requiresAuth) {
    check_auth().then((res) => {
      console.log('res:', res, to.path)
      if (res) {
        next()
      } else {
        console.log("next(/login)", to.path)
        next('/login')
      }
    })// 检查用户是否已登录
  } else {
    next()
  }
})


