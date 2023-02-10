<template>
  <div class="home-container">
    <!-- 导航栏开始部分 -->
    <van-nav-bar :border="false" placeholder class="nav-bar">
      <template #title>
        <van-button round icon="search" size="small" class="search-btn">
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- 导航栏结束部分 -->

    <!-- 文章频道列表开始部分 -->
    <van-tabs v-model="active" swipeable>
      <van-tab title="推荐">推荐</van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
    </van-tabs>
    <!-- 文章频道列表结束部分 -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      active: 0 // 控制被激活标签
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  .nav-bar {
    background-color: #f57340;

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

  /deep/ .van-tabs__wrap {
    box-shadow: 0 1px 6px #00000018;

    .van-tabs__line {
      width: 40px;
      background-color: #fc6627;
    }
  }
}
</style>
