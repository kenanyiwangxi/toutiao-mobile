<template>
  <div class="myHeader-container">
    <van-nav-bar fixed :border="border" :title="title" left-arrow placeholder @click-left="$router.back()"/>
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='less' scoped>

</style>
