<template>
  <div class="search-history">
    <van-cell-group>
      <van-cell title="搜索历史" class="title" center>
        <template #right-icon>
          <van-icon name="delete" class="delete-icon" @click="$emit('clearSearchHistories')"/>
        </template>
      </van-cell>
      <van-cell center v-for="(item,index) in searchHistories" :key="index" :title="item"
                @click="$emit('onSearch',item)">
        <template #right-icon>
          <van-icon name="cross" class="cross-icon" @click.stop="$emit('removeSearchHistory',item)"/>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: ['searchHistories']
}
</script>

<style lang='less' scoped>
.search-history {
  .title {
    color: #999;
  }

  .van-icon {
    color: #999;
  }
}
</style>
