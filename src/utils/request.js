import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载申通喏，和在组件中 this.$store 是一个东西
import store from '@/store'

// 解决后端返回数据中的大数字问题
// import jsonBig from 'json-bigint'

const request = axios.create({
  // 基础路径
  baseURL: 'http://toutiao.itheima.net'
  // transformResponse 允许自定义原始的响应数据（字符串）
  // transformResponse: [function(data) {
  //   // 后端返回的数据可能不是 JSON 格式字符串
  //   // 如果不是的话,那么 jsonBig.parse 调用就会报错
  //   // 所以我们使用 try-catch 来捕获异常,处理异常的发送
  //   try {
  //     // 如果转换成功则返回转换的数据结果
  //     return jsonBig.parse(data)
  //   } catch (err) {
  //     // 如果转换失败，则进入这里
  //     // 我们这里把数据原封不懂的直接返回给请求使用
  //     return data
  //   }
  //
  //   // axios 默认在内部使用 JSON.parse 来转换处理原始数据
  //   // JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值，这使得 JavaScript 不适合进行科学和金融方面的精确计算
  // }]
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
