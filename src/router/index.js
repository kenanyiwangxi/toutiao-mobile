import Vue from 'vue'
import VueRouter from 'vue-router'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
