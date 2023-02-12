import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Vant组件库
import Vant, { Lazyload } from 'vant'
// 引入Vant样式
import 'vant/lib/index.css'
// 引入 amfe-flexible 自动设置 REM 基准值(html标签字体大小)
import 'amfe-flexible'
// 加载全局样式(最好放在最好，用来覆盖第三方样式)
import '@/styles/index.less'
// 引入格式化时间
import '@/utils/dayjs'
// 应用懒加载
Vue.use(Lazyload)

Vue.config.productionTip = false
// 使用Vant插件
Vue.use(Vant)

// 创建 Vue 根实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
