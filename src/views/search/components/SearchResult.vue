<template>
  <div class="search-result">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$emit('searchBack',false)"/>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="search-list"
    >
      <ArtItem v-for="item in list" :item="item" :key="item.art_id" :isDelete="true"/>
    </van-list>
  </div>
</template>

<script>

import { getSearchResultAPI } from '@/api/search'
import ArtItem from '@/views/home/ArtItem.vue'

export default {
  name: 'SearchResult',
  components: { ArtItem },
  props: ['searchText'],
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pages: 1, // 页码
      perPage: 10 // 每页大小
    }
  },
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data: { data } } = await getSearchResultAPI({
        page: this.pages, // 页码
        per_page: this.perPage, // 每页数量
        q: this.searchText // 搜索字符
      })
      // 2.将数据放到数据列表中
      const { results } = data
      this.list.push(...results)
      // 3.关闭本次的loading
      this.loading = false
      // 4.判断是否还有数据
      if (results.length) {
        // 如果有，则更新下一页数据页码
        this.pages++
      } else {
        // 如果没有，则把finished设置为true，关闭加载
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.search-result {
  /deep/ .van-nav-bar .van-icon {
    color: #999;
    font-size: 36px;
  }

  .search-list {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
