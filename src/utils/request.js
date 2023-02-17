import axios from 'axios'
// 在非组件模块中获取 store 必须通过这种方式
// 这里单独加载申通喏，和在组件中 this.$store 是一个东西
import store from '@/store'
import { Toast } from 'vant'
import router from '@/router'
// 解决后端返回数据中的大数字问题
// import jsonBig from 'json-bigint'

// 刷新用户token请求
const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

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
request.interceptors.response.use(function(response) {
  // 响应成功进入这里
  return response
}, async function(error) {
  // 请求响应失败进入这里
  // 超过2xx的状态码都会进入这里
  const status = error.response.status
  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    // 如果没有 user 或 user.token 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转登录页面
      return redirectLogin()
    }
    // 如果有 refresh_token,则请求获取新的 token
    try {
      const { data: { data } } = await refreshTokenReq({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      //  拿到新的 token 之后把它更新到容器中
      user.token = data.token
      store.commit('setUser', user)

      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 这里使用 request 发请求，它会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 数据
      return request(error.config)
    } catch (err) {
      // 刷新失败跳转回登录页面
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }
  return Promise.reject(error)
})

function redirectLogin() {
  router.replace({
    name: 'Login',
    // 传递查询参数,查询参数会以 ？ 作为分隔符放到url后面
    query: {
      // 数据名是随便起的
      // router.currentRoute 和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
