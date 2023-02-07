import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import '@/styles/index.less'
// 引入Vant组件库
import Vant from 'vant'
// 引入Vant样式
import 'vant/lib/index.css'
// 引入 amfe-flexible 自动设置 REM 基准值(html标签字体大小)
import 'amfe-flexible'

Vue.config.productionTip = false
// 使用Vant插件
Vue.use(Vant)

// 创建 Vue 根实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
