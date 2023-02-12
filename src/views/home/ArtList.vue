<template>
  <div class="article-list">
    <!-- 文章列表部分开始 -->
    <van-pull-refresh :disabled="finished" v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group>
          <ArtItem v-for="item in list" :item="item" :key="item.art_id" @deleteActive="deleteActive"/>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
    <!-- 文章列表部分结束 -->
  </div>
</template>

<script>
import { getArtListAPI } from '@/api/article'
import ArtItem from '@/views/home/ArtItem.vue'

export default {
  name: 'ArtList',
  components: { ArtItem },
  data() {
    return {
      list: [], // 数据列表
      timestamp: Date.now(), // 时间戳，初始的默认值为当前的时间戳
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
      refreshing: false // 控制下滑刷新的 loading 状态
    }
  },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  methods: {
    async onLoad(isrefreshiing) {
      // 1.请求获取数据
      // timestamp: 时间戳,请求新的推荐数据传当前的时间戳,请求历史推荐数据传指定的时间戳,timestamp相当于页码,请求最新数据使用当时最新时间戳,下一页数据使用上一次返回的数据中的时间戳
      const { data: { data } } = await getArtListAPI(this.channel.id, this.timestamp)
      // 2.把数据放到list数组中
      if (isrefreshiing) {
        this.list = [...data.results, ...this.list]
        this.refreshing = false
      } else {
        this.list = [...this.list, ...data.results]
        this.loading = false
      }

      // 更新获取下一页数据的页码
      this.timestamp = data.pre_timestamp

      // 3.设置本次加载状态结束，它才可以判断是否需要加载下一次，否则会永远的停在这里
      // 4.数据全部加载完成
      if (!data.pre_timestamp) {
        this.finished = true
      }
    },
    onRefresh() {
      this.onLoad(true)
    },
    // 从文章列表中移除指定 id 的文章
    deleteActive(id) {
      // 1.炸楼操作
      this.list = this.list.filter(item => item.art_id.toString() !== id)

      // 2.判断剩余数据的文章数量是否小于 10
      if (this.list.length < 10) {
        // 主动请求下一页数据
        this.onLoad()
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article-list {
  position: fixed;
  top: 184px;
  left: 0;
  right: 0;
  bottom: 100px;
  overflow-y: auto;
}
</style>
