<template>
  <div class="home-container">
    <!-- 导航栏开始部分 -->
    <van-nav-bar :border="false" fixed placeholder class="nav-bar">
      <template #title>
        <van-button round icon="search" size="small" class="search-btn" to="/search">
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- 导航栏结束部分 -->

    <!-- 文章频道列表开始部分 -->
    <!-- 标签页组件有一个功能，只有你第一次查看标签页的时候才会渲染里面的内容 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="channel in userChannels" :title="channel.name" :key="channel.id">
        <!-- 文章列表开始部分 -->
        <ArtList :channel="channel"/>
        <!-- 文章列表结束部分 -->
      </van-tab>
      <template #nav-right>
        <div class="nav-right">
          <van-icon name="wap-nav" @click="isChannelEditShow = true"></van-icon>
        </div>
      </template>
    </van-tabs>
    <!-- 文章频道列表结束部分 -->

    <!-- 频道编辑弹出层部分开始 -->
    <van-popup v-model="isChannelEditShow" closeable position="left" :style="{ height: '100%',width: '100%' }"
               get-container="body" @close="$refs.channelEdit.isEdit = false">
      <ChannelEdit
        :user-channels="userChannels"
        :active="active"
        @addChannel="addChannel"
        @deleteChannel="deleteChannel"
        @switchChannel="switchChannel"
        @closeChannel="isChannelEditShow = false"
        ref="channelEdit"
      />
    </van-popup>
    <!-- 频道编辑弹出层部分结束 -->
  </div>
</template>

<script>
import ArtList from '@/views/home/ArtList.vue'
import ChannelEdit from '@/views/home/ChannelEdit.vue'
import { getUserChannelsAPI } from '@/api/user'
import { getItem, setItem } from '@/utils/storage'
import { mapState } from 'vuex'
import { deleteUserChannelAPI } from '@/api/channel'

export default {
  name: 'Home',
  components: {
    ArtList,
    ChannelEdit
  },
  data() {
    return {
      active: 0, // 控制被激活标签
      userChannels: [], // 频道列表
      isChannelEditShow: false // 控制弹出层状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels() {
      let channel = []
      if (this.user) {
        // 已登录，请求获取线上用户频道列表数据
        // 请求获取频道列表
        const { data: { data: { channels } } } = await getUserChannelsAPI()
        channel = channels
      } else {
        const getStorage = getItem('user-channels')
        // 没有登录，判断是否有本地存储频道列表数据
        if (getStorage) {
          // 如果有则直接使用
          channel = getStorage
        } else {
          // 没有登录，也没有本地存储的频道，那就请求获取默认推荐的频道列表
          const { data: { data: { channels } } } = await getUserChannelsAPI()
          channel = channels
          setItem('user-channels', channels)
        }
      }
      // 把处理好的数据，放到data中，以供模板使用
      this.userChannels = channel
    },
    async addChannel(channel) {
      this.userChannels.push(channel)
      // 注意该接口暂时失效 暂时只使用本地存储
      // 数据持久化
      if (this.user) {
        // 登录了,数据存储到服务器  (被阻止，提交不了)
        // await updateUserChannelsAPI({
        //   id: channel.id,
        //   seq: this.userChannels.length
        // })
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    async deleteChannel(id, index) {
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        // 登录了,数据存储到服务器
        await deleteUserChannelAPI(id)
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel(index) {
      this.active = index
    }
  },
  created() {
    this.loadChannels()
  }
}
</script>

<style lang='less' scoped>
.home-container {
  .nav-bar {
    /deep/ .van-nav-bar {
      background-color: #f57340;
    }

    /deep/ .van-nav-bar__title {
      max-width: none;

      .search-btn {
        width: 80vw;
        color: #fff;
        background-color: #ffb578a1;
        border: none;

        &::before {
          opacity: 0;
        }

        .van-button__text {
          font-size: 28px;
        }

        .van-icon {
          color: #fff;
          font-size: 32px;
        }
      }
    }
  }

  .van-tabs {
    position: fixed;
    left: 0;
    right: 0;
    padding-right: 80px;
    top: 92px;

    /deep/ .van-tabs__wrap {
      box-shadow: 0 1px 6px #00000018;

      .van-tab--active {
        font-size: 34px;
      }

      .van-tabs__line {
        width: 40px;
        background-color: #fc6627;
      }
    }
  }
}

.nav-right {
  position: fixed;
  font-size: 48px;
  color: #bfc2cb;
  background-color: #fff;
  height: 88px;
  line-height: 88px;
  text-align: center;
  width: 80px;
  right: 0;
  box-shadow: 0 1px 6px #00000018;

  &:before {
    content: "";
    width: 40px;
    height: 100%;
    position: absolute;
    left: -40px;
    top: 0;
    background: linear-gradient(270deg, #fff, hsla(0, 0%, 100%, .3));
  }
}
</style>
