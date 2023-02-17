import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/layout/Layout.vue'),
    children: [
      {
        // 默认子路由
        path: '',
        name: 'Home',
        component: () => import('@/views/home/Home.vue')
      },
      {
        path: 'qa',
        name: 'Qa',
        component: () => import('@/views/qa/Qa.vue')
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('@/views/video/Video.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/User.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/Search.vue')
  },
  {
    path: '/article/:articleId',
    name: 'Article',
    component: () => import('@/views/article/Article.vue'),
    // 将动态路由参数映射到组件的 props 中，无论是访问还是维护都很方便
    props: true
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user/UserProfile.vue')
  },
  {
    path: '/user/chat',
    name: 'UserChat',
    component: () => import('@/views/UserChat/UserChat.vue'),
    meta: { requireAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// 解决 vue-router 内部报错问题
// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}
// 路由全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 校验登录状态
    if (store.state.user) {
      next()
    } else {
      Dialog.confirm({
        title: '访问提示',
        message: '该功能需要登录才能访问,确认登录吗'
      })
        .then(() => { // 确认
          next('/login')
        })
        .catch(() => { // 取消
          // 取消了，停止路由导航
          next(false)
        })
    }
  } else {
    next()
  }
})

export default router
