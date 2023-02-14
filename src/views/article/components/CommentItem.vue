<template>
  <van-cell
    class="comment-item">
    <template #icon>
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="comment.aut_photo"
      />
    </template>
    <template #title>
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap" @click="onCommentLike">
          <van-icon :name="comment.is_liking ? 'good-job' : 'good-job-o'" class="like-icon" :color="comment.is_liking
           ? '#fc6627' : '#7e7e7e'">
            <span class="like-count">{{ comment.like_count || '' }}</span>
          </van-icon>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="footer-wrap">
        <span class="pubdate">{{ comment.pubdate | relativeTime }}</span>
        <van-button
          round
          size="mini"
          class="reply-btn"
          @click="$emit('replyClick',comment)"
        >
          {{ comment.reply_count || '' }} 回复
        </van-button>
      </div>
    </template>
  </van-cell>
</template>

<script>
import { addLikeCommentAPI, deleteLikeCommentAPI } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: ['comment'],
  methods: {
    async onCommentLike() {
      if (!this.comment.is_liking) {
        // 如果未点赞，添加点赞
        await addLikeCommentAPI(this.comment.com_id)
      } else {
        // 如果已经点赞，取消点赞
        await deleteLikeCommentAPI(this.comment.com_id)
      }
      this.$emit('handleCommentLike', this.comment.com_id)
    }
  }
}
</script>

<style lang='less' scoped>
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 20px;
  }

  .name {
    font-size: 28px;
    color: #996c40;
  }

  .content {
    font-size: 26px;
    color: #222;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .like-wrap {
      display: flex;
      align-items: center;

      .like-icon {
        font-size: 32px;
      }

      .like-count {
        font-size: 28px;
        margin-left: 4px;
        color: #7e7e7e;
      }
    }

  }

  .footer-wrap {
    display: flex;
    align-items: center;

    .pubdate {
      font-size: 24px;
      margin-right: 16px;
      color: #7a7a7a;
    }

    .reply-btn {
      border: none;
      background-color: #f7f8fa;
      color: #494949;
      font-size: 24px;
      height: 38px;
      letter-spacing: 1px;

      .van-button__text {
        padding: 0 10px;
      }
    }
  }
}
</style>
