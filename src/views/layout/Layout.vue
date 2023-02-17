<template>
  <div class="layout-container">
    <!-- 子路由出口 或者说是二级路由 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!-- 底部导航栏 -->
    <van-tabbar route active-color="#fc6627">
      <van-tabbar-item :to="{name:'Home'}" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/qa" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  mounted() {
    this.$store.commit('addCachePage', 'Layout')
  }
}
</script>

<style lang='less' scoped>

</style>
