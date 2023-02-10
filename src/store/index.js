import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // 当前登录用户的登录状态(token等数据)
    // 在这里存放的优点： 1.获取方便  2.响应式数据
    user: getItem(USER_KEY)
    // user: localStorage.getItem('user')
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是为了持久化数据
      setItem(USER_KEY, state.user)
      // localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {},
  modules: {}
})
