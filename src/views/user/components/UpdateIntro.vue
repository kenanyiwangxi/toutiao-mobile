<template>
  <div class="update-intro">
    <!-- 导航栏部分开始 -->
    <van-nav-bar
      title="编辑简介"
      right-text="完成"
      left-arrow
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 导航栏部分结束 -->

    <div class="updateInput">
      <van-field
        v-model="localIntro"
        rows="2"
        autosize
        type="textarea"
        maxlength="15"
        placeholder="请填写简介"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfileAPI } from '@/api/user'

export default {
  name: 'UpdateIntro',
  props: ['value'],
  data() {
    return {
      localIntro: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      await updateUserProfileAPI({
        intro: this.localIntro
      })
      this.$emit('close')
      // this.$emit('updateName', this.localName)
      // 发布input事件，更新父组件 v-model 绑定的数据
      this.$emit('input', this.localIntro)
      this.$toast.success('修改成功')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
