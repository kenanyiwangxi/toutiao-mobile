<template>
  <div class="post-comment">
    <div class="describe">
      <p style="margin-top: 0">评论描述</p>
      <van-form @submit="postComment" ref="form" :show-error-message="false">
        <van-field
          v-model.trim="comment"
          rows="4"
          autosize
          type="textarea"
          maxlength="100"
          :placeholder="huifu_name"
          show-word-limit
          class="describe-input"
          ref="input"
        />
        <van-button :disabled="!comment" block type="info" native-type="submit"
                    color="linear-gradient(to left, #ff6034, #ee0a24)">
          提交
        </van-button>
      </van-form>
    </div>
  </div>
</template>

<script>
import { postCommentAPI } from '@/api/comment'

export default {
  name: 'PostComment',
  props: {
    // 如果是发布文章评论，则传递文章 ID
    // 如果是发布评论回复，则传递评论 ID
    target: {
      type: [Number, String, Object],
      require: true
    },

    // 如果是发布评论回复，则也需要传递文章ID
    articleId: {
      type: [Number, String, Object],
      default: null
    },
    huifu_name: {
      type: String,
      default: '说点什么~'
    }
  },
  data() {
    return {
      comment: '' // 评论内容
    }
  },
  methods: {
    async postComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true
      })
      const { data: { data } } = await postCommentAPI({
        target: this.target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.comment, // 评论内容
        art_id: this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
      })
      this.$emit('postSuccess', data.new_obj)
      this.$toast.success('评论成功')
    }
  }
}
</script>

<style lang='less' scoped>
.post-comment {
  padding: 16px 0 32px;
}

.describe {
  padding: 0 32px;

  .describe-input {
    padding: 20px 0;
  }

  p {
    margin-bottom: 4px;
  }

  /deep/ .van-cell__value {
    background-color: #f4f4f4;
    padding: 24px;
    border-radius: 10px;
  }
}
</style>
