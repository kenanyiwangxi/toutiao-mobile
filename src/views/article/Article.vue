<template>
  <div class="article-container">
    <!-- 导航栏部分开始 -->
    <van-nav-bar left-arrow placeholder fixed @click-left="$router.back()">
      <template #title>
        <div v-show="isUserShow" v-if="articleDetails" class="header-title">
          <van-image
            class="avatar"
            width="24"
            height="24"
            round
            fit="cover"
            :src="articleDetails.aut_photo"
          />
          <span class="small-name van-ellipsis">{{ articleDetails.aut_name }}</span>
          <van-button
            class="follow"
            :loading="isFollowLoading"
            :class="articleDetails.is_followed ? '' : 'current'"
            @click="onFollow"
          >
            {{ articleDetails.is_followed ? '已关注' : '关注' }}
          </van-button>
        </div>
      </template>
      <template #right>
        <van-icon name="ellipsis" size="20" @click="showShare = true"/>
      </template>
    </van-nav-bar>
    <!-- 导航栏部分结束 -->

    <!-- 文章信息部分开始 -->
    <div class="article-wrapper" v-if="articleDetails" ref="article-wrapper">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articleDetails.title }}</h1>
      <p class="art-text">
        {{ articleDetails.pubdate | formatTime('YYYY年MM月DD日') }}
        <span>{{ articleDetails.read_count }} 阅读</span>
        <span>{{ articleDetails.comm_count }} 评论</span>
      </p>
      <!-- 用户信息 -->
      <van-cell center :title="articleDetails.aut_name" :label="articleDetails.pubdate | relativeTime" class="user-info"
                border>
        <template #icon>
          <van-image
            class="avatar"
            width="40"
            height="40"
            round
            fit="cover"
            :src="articleDetails.aut_photo"
          />
        </template>
        <!-- 是否关注了作者 -->
        <van-button
          round
          :plain="articleDetails.is_followed"
          size="small"
          class="follow-btn"
          :loading="isFollowLoading"
          :class="articleDetails.is_followed ? '' : 'fill'"
          @click="onFollow"
        >
          {{ articleDetails.is_followed ? '已关注' : '+ 关注' }}
        </van-button>
      </van-cell>
      <!-- 正文部分 -->
      <div
        class="content markdown-body"
        ref="article-content"
        v-html="articleDetails.content">
      </div>
      <!-- 文章发布时间 -->
      <p class="pubdate">文章发布时间: {{ articleDetails.pubdate }}</p>

      <!-- 分割线 -->
      <div class="space"></div>
      <span class="spaced"></span>
      <!-- 无评论头部部分开始 -->
      <div class="no-comment" v-if="!articleDetails.comm_count">
        <van-cell
          title="全部评论"
          center
        ></van-cell>
        <van-empty description="还没有评论喔"/>
      </div>
      <!-- 文章评论部分开始 -->
      <CommentList
        :source="articleId"
        :commentList="commentList"
        @updateCommentList="updateCommentList"
        @replyClick="onReplyClick"
        @updateCommentLike="updateCommentLike"
        v-else/>
      <!-- 文章评论部分结束 -->
    </div>
    <!-- 文章信息部分结束 -->

    <!-- 底部区域部分开始 -->
    <div class="article-footer" v-if="articleDetails">
      <van-button
        round
        icon="edit"
        class="edit-btn"
        @click="isPostShow = true"
      >
        抢沙发...
      </van-button>
      <div class="article-handle" @click="scrollToComment">
        <van-icon name="comment-o" :badge="articleDetails.comm_count || ''"></van-icon>
        <span>评论</span>
      </div>
      <div class="article-handle">
        <van-icon
          :color="articleDetails.attitude === 1 ? '#fc6627' : '#333'"
          :name=" articleDetails.attitude=== 1 ? 'good-job' :'good-job-o'"
          @click="onLike"
        >
        </van-icon>
        <span>点赞</span>
      </div>
      <div class="article-handle">
        <van-icon :name="articleDetails.is_collected ? 'star' : 'star-o'" @click="onCollected"
                  :color="articleDetails.is_collected ? '#fc6627' : '#333'"></van-icon>
        <span>收藏</span>
      </div>
      <div class="article-handle" @click="showShare=true">
        <van-icon name="share-o"></van-icon>
        <span>分享</span>
      </div>
    </div>
    <!-- 底部区域部分结束 -->

    <!-- 分享板块 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      get-container="body"
    />

    <!-- 发布评论部分开始 -->
    <van-action-sheet v-model="isPostShow" title="评论文章" @close="$refs.postComment.comment = ''">
      <PostComment ref="postComment" :target="articleId" @postSuccess="onPostSuccess"/>
    </van-action-sheet>
    <!-- 发布评论部分结束 -->

    <!-- 评论回复部分开始 -->
    <van-action-sheet v-model="isReplyShow" v-if="replyComment" :title="`${replyComment.reply_count}条回复`">
      <!-- 这里使用 v-if 的目的是让组件随着弹出层的显示进行渲染和销毁，防止加载过的组件不重新渲染导致数据不会重新加载的问题 -->
      <CommentReply v-if="isReplyShow" :comment="replyComment" :articleId="articleId"/>
    </van-action-sheet>
    <!-- 评论回复部分结束 -->
  </div>
</template>

<script>
// 在组建中获取动态路由参数：
//    方式一：this.$router.params.xxx
//    方式二：props 传参,推荐做法
import CommentList from '@/views/article/components/CommentList.vue'
import './github-markdown.css'
import {
  getArticleDetailsAPI,
  addCollectionAPI,
  deleteCollectionAPI,
  addLikingsAPI,
  deleteLikingsAPI
} from '@/api/article'
import { addFollowAPI, deleteFollowPI } from '@/api/user'
import PostComment from '@/views/article/components/PostComment.vue'
import CommentReply from '@/views/article/components/CommentReply.vue'
// 图片预览
import { ImagePreview } from 'vant'
// 平滑滚动
import { animate } from 'popmotion'

export default {
  name: 'Article',
  props: ['articleId'],
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  data() {
    return {
      showShare: false, // 分享面板开关
      options: [
        [
          {
            name: '微信',
            icon: 'wechat'
          },
          {
            name: '朋友圈',
            icon: 'wechat-moments'
          },
          {
            name: '微博',
            icon: 'weibo'
          },
          {
            name: 'QQ',
            icon: 'qq'
          }
        ],
        [
          {
            name: '复制链接',
            icon: 'link'
          },
          {
            name: '分享海报',
            icon: 'poster'
          },
          {
            name: '二维码',
            icon: 'qrcode'
          },
          {
            name: '小程序码',
            icon: 'weapp-qrcode'
          }
        ]
      ], // 分享面板内容
      articleDetails: null, // 文章详情
      isUserShow: false, // 判断header部分user信息显示
      isFollowLoading: false, // 关注用户按钮的 loading效果
      isPostShow: false, // 控制发送评论显示状态
      commentList: [], // 文章评论列表
      isReplyShow: false, // 控制回复的显示状态
      replyComment: null // 当前回复评论对象
    }
  },
  methods: {
    async getArticleDetails() {
      const { data: { data } } = await getArticleDetailsAPI(this.articleId)
      this.articleDetails = data

      // 数据改变影响视图更新 (DOM数据) 不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，需要把这段代码放到 $nextTick 中
      // this.$nextTick 是Vue提供的一个方法 在特定事件进行调用 是一个生命周期钩子
      this.$nextTick(() => {
        this.handlePreviewImage()
        this.handleHeaderUser()
      })
    },
    handlePreviewImage() {
      // 1.获取文章内容 DOM 容器
      const articleContent = this.$refs['article-content']
      // 2.得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')
      // 收集所有图片路径
      const imgPaths = [...imgs].map(item => item.src)
      // 3.循环 img 列表，给img注册点击事件
      imgs.forEach((item, index) => {
        item.addEventListener('click', () => {
          // 4.在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths, // 图片路径
            startPosition: index // 起始位置
          })
        })
      })
    },
    handleHeaderUser() {
      const articleWrapper = this.$refs['article-wrapper']
      const articleContent = this.$refs['article-content']
      articleWrapper.addEventListener('scroll', () => {
        this.isUserShow = articleContent.getBoundingClientRect().top <= 46
      })
    },
    async onFollow() {
      this.isFollowLoading = true
      if (this.articleDetails.is_followed) {
        // 已关注 => 取消关注
        await deleteFollowPI(this.articleDetails.aut_id)
        // this.articleDetails.is_followed = false
      } else {
        // 未关注 => 添加关注
        await addFollowAPI(this.articleDetails.aut_id)
        // this.articleDetails.is_followed = true
      }
      this.isFollowLoading = false
      // 更新视图
      this.articleDetails.is_followed = !this.articleDetails.is_followed
      this.$toast.success(`${this.articleDetails.is_followed ? '关注成功' : '取消关注'}`)
    },
    onLike() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.articleDetails.attitude === 1) {
        // 已经喜欢，取消喜欢
        deleteLikingsAPI(this.articleDetails.art_id)
        this.articleDetails.attitude = -1
      } else {
        // 还未喜欢，添加喜欢
        addLikingsAPI(this.articleDetails.art_id)
        this.articleDetails.attitude = 1
      }
      this.$toast.success(`${this.articleDetails.attitude === 1 ? '点赞成功' : '取消点赞'}`)
    },
    async onCollected() {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.articleDetails.is_collected) {
        // 已经收藏,取消收藏
        await deleteCollectionAPI(this.articleDetails.art_id)
      } else {
        // 还未收藏，添加收藏
        await addCollectionAPI(this.articleDetails.art_id)
      }
      this.articleDetails.is_collected = !this.articleDetails.is_collected
      this.$toast.success(`${this.articleDetails.is_collected ? '收藏成功' : '取消收藏'}`)
    },
    onPostSuccess(comment) {
      // 把发布成功的评论数据对象放到评论列表顶部
      this.articleDetails.comm_count++
      this.commentList.unshift(comment)
      // 关闭发布评论弹出层
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
    },
    onReplyClick(comment) {
      this.replyComment = comment
      // 展示回复内容
      this.isReplyShow = true
    },
    // 滚动到评论列表区域
    scrollToComment() {
      console.log(1)
      const wrapper = document.querySelector('.article-wrapper')
      // 1.当前滚动条位置
      const now = wrapper.scrollTop
      console.log(now)
      // 2.目标位置(文章信息区域的高度)
      const dist = document.querySelector('.spaced').offsetTop
      console.log(dist)

      // 3.实现滚动动画
      animate({
        from: now, // 当前位置
        to: dist, // 目标位置
        onUpdate: latest => wrapper.scrollTo(0, latest)
      })
    }
  },
  created() {
    this.getArticleDetails()
  }
}
</script>

<style lang='less' scoped>
.article-container {
  /deep/ .van-nav-bar .van-icon {
    color: #4b4b4b;
    font-size: 36px;
  }

  .article-wrapper {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding-bottom: 100px;

    .art-title {
      font-size: 40px;
      color: #3a3a3a;
      font-weight: 500;
      letter-spacing: 1px;
      padding: 0 32px;
      background-color: #fff;
    }

    .art-text {
      font-size: 24px;
      color: #a5a6ab;
      padding: 0 32px;

      span {
        display: inline-block;
        padding-left: 8px;
        margin-left: 6px;
        height: 20px;
        line-height: 20px;
        border-left: 2.5px solid #bfc2cb;
      }
    }

    .user-info {
      border-bottom: 2.5px solid #f6f6f6;
      padding: 20px 32px 48px;

      .avatar {
        margin-right: 16px;
      }

      .van-cell__label {
        margin-top: 0;
        color: #b4b4b4;
        line-height: 28px;
      }

      .follow-btn {
        width: 130px;
        height: 58px;
        border: 2px solid #fc6627;
        color: #fc6627;

        &.fill {
          background-color: #fc6627;
          color: #fff;
        }
      }
    }

    .content {
      padding: 32px 32px;
    }

    .pubdate {
      text-align: right;
      color: #a5a6ab;
      font-size: 24px;
      padding: 0 32px 20px;
    }

    .space {
      width: 100%;
      height: 25px;
      background-color: #f7f8fa;
    }
  }

  /deep/ .van-nav-bar__title {
    max-width: none;
    margin: 0;
    padding: 0 108px;
  }

  .header-title {
    display: flex;
    align-items: center;
    width: 100vw;

    .small-name {
      font-size: 28px;
      height: 28px;
      line-height: 28px;
      margin-left: 10px;
      max-width: 300px;
    }

    .follow {
      font-size: 24px;
      height: 24px;
      line-height: 24px;
      padding-left: 16px;
      margin-left: 16px;
      border: none;
      border-left: 2.5px solid #ccc !important;
      color: #ccc;
    }

    .follow.current {
      color: #fc6627;
    }
  }

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
      height: 65px;
      font-size: 24px;
      width: 320px;
      justify-content: flex-start;
      background-color: #f7f8fa !important;
      border: none;
      padding-left: 30px;
      color: #969799;

      .van-button__content {
        justify-content: flex-start;
      }

      &:active::before {
        opacity: 0;
      }
    }

    .article-handle {
      display: flex;
      flex-direction: column;
      align-items: center;

      .van-icon {
        font-size: 40px;
        color: #333;
      }

      span {
        font-size: 24px;
        color: #333;
      }

      .van-info {
        line-height: unset;
        background-color: #fc6627;
        top: 4px;
        right: -4px;
      }
    }
  }
}

/deep/ .van-share-sheet__options {
  justify-content: space-around;
}

/deep/ .van-share-sheet__cancel {
  color: #494949;
}
</style>
