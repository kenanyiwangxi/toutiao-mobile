<template>
  <div class="comment-reply">
    <!-- 当前评论项项部分开始 -->
    <CommentItem :comment="comment"/>
    <!-- 当前评论项项部分结束 -->

    <!-- 所有评论回复 -->
    <CommentList
      @updateCommentList="updateCommentList"
      @updateCommentLike="updateCommentLike"
      :commentList="commentList" type="c"
      :source="comment.com_id"/>

    <!-- 底部区域部分开始 -->
    <div class="article-footer">
      <van-button
        round
        icon="edit"
        class="edit-btn"
        color="linear-gradient(to left, #ff6034, #ee0a24)"
        @click="isPostShow = true"
      >
        抢沙发...
      </van-button>
    </div>
    <!-- 底部区域部分结束 -->

    <!-- 发布回复部分开始 -->
    <van-action-sheet v-model="isPostShow" title="评论文章" @close="$refs.postComment.comment = ''">
      <PostComment @postSuccess="onPostSuccess" ref="postComment" :target="comment.com_id" :articleId="articleId" :huifu_name="`@${comment.aut_name}`"/>
    </van-action-sheet>
    <!-- 发布回复部分结束 -->
  </div>
</template>

<script>
import CommentItem from '@/views/article/components/CommentItem.vue'
import CommentList from '@/views/article/components/CommentList.vue'
import PostComment from '@/views/article/components/PostComment.vue'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: ['comment', 'articleId'],
  data() {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess(comment) {
      // 将发布成功的评论放到评论列表的顶端
      this.commentList.unshift(comment)
      // 更新评论的回复数量
      // eslint-disable-next-line vue/no-mutating-props
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    },
    updateCommentList(item) {
      this.commentList.push(...item)
    },
    updateCommentLike(id) {
      this.commentList.find(item => {
        if (item.com_id === id) {
          item.is_liking = !item.is_liking
          if (item.is_liking) {
            item.like_count++
          } else {
            item.like_count--
          }
          return true
        }
        return false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.comment-reply {
  .article-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #f4f4f4;
    background-color: #fff;

    .edit-btn {
      height: 100px;
      font-size: 32px;
      width: 100%;
      justify-content: center;
      background-color: #f7f8fa !important;
      border: none;
      padding-left: 30px;
      color: #fff;

      &:active::before {
        opacity: 0;
      }
    }
  }
}
</style>
