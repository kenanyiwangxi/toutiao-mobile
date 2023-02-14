import Vue from 'vue'
// 引入dayjs
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'
// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)

// 定义计算相对时间时间的全局过滤器
Vue.filter('relativeTime', dt => {
  // dt 参数是文章发表时间
  // 调用dayjs() 得到当前的时间
  // .to() 方法的返回值,是计算出来的"相对时间"
  return dayjs(dt).from(dayjs())
})

// 定义时间格式化的全局过滤器
Vue.filter('formatTime', (dt, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(dt).format(format)
})
