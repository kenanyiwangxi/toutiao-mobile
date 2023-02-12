<template>
  <div class="channel-edit">
    <!-- 我的频道部分开始 -->
    <van-cell center :border="false">
      <template #title>
        <span class="title">我的频道:</span>
        <span class="text">{{ isEdit ? '点击删除频道' : '点击进入频道' }}</span>
      </template>
      <van-button type="danger" :plain="!isEdit" round size="mini" color="#fc7942" @click="isEdit = !isEdit">
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel,index) in userChannels"
        :key="channel.id"
        :text="channel.name"
        class="grid-item myChannel"
        :icon="(isEdit && channel.id) ? 'clear' : ''"
        @click="onUserChannelClick(channel.id,index)"
        :class="{active: index === active}"
      />
    </van-grid>
    <!-- 我的频道部分结束 -->

    <!-- 可选频道部分开始 -->
    <van-cell center :border="false" class="choice">
      <template #title>
        <span class="title">可选频道:</span>
        <span class="text">点击添加频道</span>
      </template>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in recommend"
        :key="channel.id"
        :text="channel.name"
        class="grid-item"
        @click="onAdd(channel)"
      />
    </van-grid>
    <!-- 可选频道部分结束 -->
  </div>
</template>

<script>
import { getAllChannelsAPI } from '@/api/channel'

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道列表数据
      isEdit: false // 控制编辑的显示状态
    }
  },
  computed: {
    // 推荐的频道列表
    recommend() {
      // 所有频道 - 我的频道 = 剩下的推荐频道
      // filter 方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断 channel 是否属于我的频道
        // find 方法查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })
      // const arr = []
      // this.allChannels.forEach(channel => {
      //   let flag = false
      //   for (let i = 0; i < this.userChannels.length; i++) {
      //     if (this.userChannels[i].id === channel.id) {
      //       flag = true
      //       break
      //     }
      //   }
      //   if (!flag) {
      //     arr.push(channel)
      //   }
      // })
      // return arr
    }
  },
  methods: {
    async loadAllChannels() {
      const { data: res } = await getAllChannelsAPI()
      if (res.message === 'OK') {
        this.allChannels = res.data.channels
      }
    },
    onAdd(channel) {
      this.$emit('addChannel', channel)
    },
    onUserChannelClick(id, index) {
      if (this.isEdit) {
        // 如果是编辑状态,删除频道
        this.deleteMyChannel(id, index)
      } else {
        // 如果是非编辑状态,切换频道
        this.switchMyChannel(index)
      }
    },
    deleteMyChannel(id, index) {
      // 如果是点击的是推荐且在编辑状态下，直接退出
      if (index === 0) {
        return
      } else if (index <= this.active) {
        // 如果删除的是当前激活频道之前的频道
        // 更新频道的索引
        this.$emit('switchChannel', this.active - 1)
      }
      this.$emit('deleteChannel', id, index)
      this.$toast('删除成功')
    },
    switchMyChannel(index) {
      this.$emit('switchChannel', index)
      this.$emit('closeChannel')
    }
  },
  created() {
    this.loadAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  padding-top: 108px;
  padding-bottom: 60px;

  .choice {
    margin-top: 40px;
  }

  .title {
    font-size: 32px;
    color: #333;
    margin-right: 16px;
  }

  .text {
    font-size: 24px;
    color: #a8a8a8;
  }

  .van-button {
    padding: 0 26px;
  }

  /deep/ .myChannel.active {
    .van-grid-item__text {
      color: #fc6627 !important;
    }
  }

  .grid-item {
    border: none;

    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      border-radius: 10px;
      padding: 16px;

      .van-grid-item__text {
        font-size: 26px;
        color: #222;
        margin-top: 0;
      }
    }

    /deep/ .van-grid-item__content--surround::after {
      border: none;
    }

    /deep/ .van-grid-item__icon {
      position: absolute;
      top: -6px;
      right: -6px;
      font-size: 28px;
      color: #7e7e7e;
    }
  }
}
</style>
