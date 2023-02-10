<template>
  <div class="myHeader-container">
    <van-nav-bar :border="false" :title="title" left-arrow placeholder @click-left="$router.back()"/>
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  props: ['title']
}
</script>

<style lang='less' scoped>

</style>
