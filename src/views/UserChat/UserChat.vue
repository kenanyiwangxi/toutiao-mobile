<template>
  <div class="user-chat">
    <MyHeader title="小智同学" border/>

    <!-- 消息列表部分开始 -->
    <van-cell-group class="message-list">
      <van-cell title="单元格"/>
      <van-cell title="单元格"/>
      <van-cell title="单元格"/>
      <van-cell title="单元格"/>
    </van-cell-group>
    <!-- 消息列表部分结束 -->

    <!-- 发送消息部分开始 -->
    <van-cell-group class="postMessage">
      <van-field left-icon="edit" v-model="message" placeholder="请描述您的问题"/>
      <span class="post">发送</span>
    </van-cell-group>
    <!-- 发送消息部分结束 -->
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue'
// import { io } from 'socket.io-client'

// 建立连接 接口跨域
// const socket = io('http://toutiao.itheima.net')
// socket.on('connect', function() {
//   console.log('连接建立成功了')
// })
// // socket.on('event', function(data) {
// // })
// socket.on('disconnect', function() {
//   console.log('断开连接了')
// })
export default {
  name: 'UserChat',
  components: { MyHeader },
  data() {
    return {
      message: ''
    }
  }
}
</script>

<style lang='less' scoped>
.user-chat {
  .message-list {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 92px;
    overflow: auto;
  }

  .postMessage {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    .van-field {
      background-color: #f7f8fa;
      padding: 8px 28px;
      margin: 14px;
      font-size: 24px;
      border-radius: 10px;
      flex: 1;

      /deep/ .van-icon {
        color: #999999;
      }
    }

    .post {
      height: 60px;
      line-height: 60px;
      padding: 0 24px;
      margin: 0 20px;
      background: #fc6627;
      color: #fff;
      font-size: 24px;
      border-radius: 8px;

      &:active {
        transform: scale(.98);
      }
    }
  }
}
</style>
