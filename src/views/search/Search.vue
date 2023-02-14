<template>
  <div class="search-container">
    <!-- 搜索栏部分开始 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。-->
    <form action="/">
      <van-search
        v-model.trim="searchText"
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        show-action
        shape="round"
        v-if="!isResultShow"
      >
        <template #left>
          <van-icon name="arrow-left" @click="$router.back()"/>
        </template>
        <template #action>
          <div @click="onSearch(searchText)">搜索</div>
        </template>
      </van-search>
    </form>
    <!-- 搜索栏部分结束 -->

    <!-- 搜索结果部分开始 -->
    <SearchResult v-if="isResultShow" @searchBack="searchBack" :search-text="searchText"/>
    <!-- 搜索结果部分结束 -->

    <!-- 联想建议部分开始 -->
    <SearchSuggestion v-else-if="searchText" :search-text="searchText" @onSearch="onSearch"/>
    <!-- 联想建议部分结束 -->

    <!-- 历史记录部分开始 -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @onSearch="onSearch"
      @removeSearchHistory="removeSearchHistory"
      @clearSearchHistories="clearSearchHistories"
    />
    <!-- 历史记录部分结束 -->
  </div>
</template>

<script>
import SearchSuggestion from '@/views/search/components/SearchSuggestion.vue'
import SearchHistory from '@/views/search/components/SearchHistory.vue'
import SearchResult from '@/views/search/components/SearchResult.vue'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'Search',
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  data() {
    return {
      searchText: '', // 搜索框内容
      isResultShow: false, // 控制搜索结果显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  methods: {
    onSearch(searchText) {
      // 让输入框设置为你要搜索的文本
      this.searchText = searchText

      if (!searchText) {
        return this.$toast({
          message: '请输入搜索关键词',
          position: 'top'
        })
      }

      // 如果历史已经存在过,删除原有历史记录，然后重新追加
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项删除
        this.searchHistories.splice(index, 1)
      }

      // 在前面追加最新的历史记录
      this.searchHistories.unshift(searchText)

      // 如果用户已登录,则把搜索历史记录存储到线上
      //  提示：只要我们调用获取搜索结果的数据接口，后端会给我们自动存储用户搜索历史记录
      // 如果用户没有登录，则把搜索历史记录存储到本地

      // 展示搜索结果
      this.isResultShow = true
    },
    searchBack(show) {
      this.isResultShow = show
      this.searchText = ''
    },
    // 清空历史记录
    clearSearchHistories() {
      this.searchHistories = null
    },
    // 删除指定历史记录
    removeSearchHistory(str) {
      this.searchHistories = this.searchHistories.filter(item => item !== str)
    }
  },
  watch: {
    searchHistories(val) {
      // 持久化历史记录
      setItem('search-histories', val)
    }
  }
}
</script>

<style lang='less' scoped>
.search-container {
  .van-icon {
    color: #3d3d3d;
    font-size: 32px;
  }

  .van-search__content {
    margin: 0 16px;
  }
}
</style>
