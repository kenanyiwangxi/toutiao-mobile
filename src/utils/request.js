import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载申通喏，和在组件中 this.$store 是一个东西
import store from '@/store'

const request = axios.create({
  // 基础路径
  baseURL: 'http://toutiao.itheima.net'
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const { user } = store.state

  // 如果用户已登录,同意给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 处理完之后一定要发 config 返回，否则请求就会停在这里
  return config
}, (error) => {
  return Promise.reject(error)
})
// 响应拦截器

export default request
