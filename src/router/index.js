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
  }
]

const router = new VueRouter({
  routes
})

export default router
