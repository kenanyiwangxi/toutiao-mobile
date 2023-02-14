<template>
  <div class="search-suggestion">
    <van-cell-group>
      <van-cell v-for="(str,index) in suggestions" :key="index" icon="search" @click="$emit('onSearch', str)">
        <template #title>
          <div v-html="highlight(str)"></div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestionAPI } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: ['searchText'],
  data() {
    return {
      suggestions: [], // 联想建议数据列表
      timerId: null // 延时器id
    }
  },
  watch: {
    // 属性名：要监视数据的名称
    searchText: {
      // 该回调会在侦听之后立即调用
      immediate: true,
      // 当数据发生变化则会指向 handler 处理函数
      // 使用防抖函数
      handler: debounce(async function() {
        // 找到数据接口
        // 请求获取数据
        // 处理响应数据
        const { data: { data } } = await getSearchSuggestionAPI(this.searchText)
        this.suggestions = data.options.filter(item => item)
      }, 500)
      // 自己写
      // handler() {
      //   // 找到数据接口
      //   // 请求获取数据
      //   // 处理响应数据
      //   // 2.关闭上次延时器,重新计时
      //   clearTimeout(this.timerId)
      //   // 1.开启眼延时器,并给data中的 timerId赋值
      //   this.timerId = setTimeout(async() => {
      //     const { data: { data } } = await getSearchSuggestionAPI(this.searchText)
      //     this.suggestions = data.options.filter(item => item)
      //   }, 500)
      // }
    }
  },
  methods: {
    highlight(str) {
      // 正则表达式 /中间的内容/ 都会当作正则匹配模式字符来对待
      // 错误的写法： /this.searchText/
      // RegExp是正则表达式的构造函数
      // 参数1：字符串
      // 参数2：匹配模式
      // 返回值： 正则对象
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang='less' scoped>

</style>
