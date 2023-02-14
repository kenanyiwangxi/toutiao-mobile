<template>
  <div class="comment-list">
    <!-- 评论头部部分开始 -->
    <van-cell
      title="全部评论"
      center
    ></van-cell>
    <!-- 评论头部部分结束 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem
        v-for="(comment,index) in commentList"
        :key="index"
        :comment="comment"
        @handleCommentLike="handleCommentLike"
        @replyClick="$emit('replyClick',$event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getCommentsAPI } from '@/api/comment'
import CommentItem from '@/views/article/components/CommentItem.vue'

export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object]
    },
    commentList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'a'
    }
  },
  components: { CommentItem },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 // 每页数据多少
    }
  },
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data: { data } } = await getCommentsAPI({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source, // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      // 2.把数据放到列表中
      // this.list.push(...data.results)
      this.$emit('updateCommentList', data.results)
      // 3.关闭加载动画
      this.loading = false
      // 4.判断是否还有数据
      if (data.results.length) {
        //    如果有，更新获取下一次数据的页码
        this.offset = data.last_id
      } else {
        //    如果没有，将finished设置为true
        this.finished = true
      }
    },
    handleCommentLike(id) {
      this.$emit('updateCommentLike', id)
    }
  }
}
</script>

<style lang='less' scoped>

</style>
