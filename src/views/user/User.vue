<template>
  <div class="user-container">
    <!-- 登录状态头部显示 -->
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        :border="false"
        value="个人信息"
        center
        is-link
        to="/"
      >
        <template #icon>
          <van-image
            width="48"
            height="48"
            round
            fit="cover"
            :src="currentUser.photo"
          />
        </template>
        <template #title>
          <div class="title">{{ currentUser.name }}</div>
        </template>
      </van-cell>
      <van-grid :border="false">
        <van-grid-item>
          <template #text>
            <div class="data">{{ currentUser.art_count }}</div>
            <div class="text">动态</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="data">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="data">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="data"> {{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录状态头部显示 -->
    <div v-else class="not-login">
      <div class="not-wrapper" @click="$router.push('/login')">
        <div class="not-box">
          <i class="toutiao toutiao-shouji1"></i>
        </div>
        <p>点击登录</p>
      </div>
    </div>
    <van-grid :icon-size="26" class="column" :border="false">
      <van-grid-item icon-prefix="toutiao" icon="a-xiaoxitongzhitixing" text="消息通知"/>
      <van-grid-item icon-prefix="toutiao" icon="shoucang2" text="我的收藏"/>
      <van-grid-item icon-prefix="toutiao" icon="lishi" text="阅读历史"/>
      <van-grid-item icon-prefix="toutiao" icon="zuopin" text="我的作品"/>
    </van-grid>
    <div class="service">
      <span class="title">更多服务</span>
      <van-grid :icon-size="26" :border="false">
        <van-grid-item icon-prefix="toutiao" icon="tubiaozhuanqu-24" text="用户反馈"/>
        <van-grid-item icon-prefix="toutiao" icon="kefu" text="小智同学"/>
      </van-grid>
    </div>
    <div class="btn" v-if="user">
      <div class="logout" block @click="onLogout">退出登录</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'User',
  data() {
    return {
      currentUser: { // 当前登录用户信息
        like_count: 0,
        fans_count: 0,
        follow_count: 0,
        art_count: 0
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapMutations(['setUser']),
    async onLogout() {
      // 提示用户确认退出
      // 确认 --> 处理退出
      await this.$dialog.confirm({
        title: '退户确认',
        message: '退出当前头条账号,将不能同步收藏、发布、评论和云端分析等',
        confirmButtonColor: '#fc6627'
      })
      // 清楚用户登录状态
      this.setUser(null)
    },
    async loadCurrentUser() {
      const { data: { data } } = await getCurrentUser()
      this.currentUser = data
    }
  },
  created() {
    this.loadCurrentUser()
  }
}
</script>

<style lang='less' scoped>
.user-container {
  height: 100vh;
  background-color: #f8f8f8;

  .my-info,
  .not-login {
    background: url("@/assets/banner.png") no-repeat center center/cover;
    min-height: 480px;
    position: relative;
    border-bottom-right-radius: 110px;
    border-bottom-left-radius: 110px;
    overflow: hidden;
    color: #fff;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #A68661B3;
    }

    .van-cell {
      background: unset;
      color: #ffffff;
      padding-top: 60px !important;

      .van-cell__title {
        margin-left: 20px;
        font-size: 36px;
        font-weight: 500;
        display: flex;
        align-content: center !important;
      }

      .van-cell__value {
        color: #fff;
        font-size: 24px;
      }

      .van-cell__right-icon {
        color: #fff;
        font-size: 28px;
      }

      .van-image {
        border: 6px solid #8D5836CB;
      }
    }

    .van-grid {
      padding: 20px 16px;

      /deep/ .van-grid-item__content {
        background: unset;
        color: #fff;
        font-size: 30px;
        letter-spacing: 2px;

        .data {
          font-size: 28px;
          letter-spacing: 0;
        }
      }
    }
  }

  .column {
    margin-top: -120px;
    margin-bottom: 32px;
    padding: 0 32px;
    overflow: hidden;
  }

  /deep/ .van-grid-item__icon {
    color: #3f3f3f;
  }

  /deep/ .van-grid-item:first-child .van-grid-item__content {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  /deep/ .van-grid-item:last-child .van-grid-item__content {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .service {
    margin: 0 32px;
    background-color: #fff;
    border-radius: 12px;

    span.title {
      display: inline-block;
      padding: 20px 32px 10px;
      color: #3f3f3f;
    }
  }

  .btn {
    padding: 32px;

    .logout {
      padding: 22px 32px;
      text-align: center;
      border-radius: 12px;
      letter-spacing: 2px;
      color: #fc6627;
      background-color: #fff;
    }
  }

  .not-login {
    .not-wrapper {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .not-box {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #d45622;

        i {
          font-size: 90px;
        }
      }

      p {
        margin-top: 10px !important;
        font-size: 28px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
