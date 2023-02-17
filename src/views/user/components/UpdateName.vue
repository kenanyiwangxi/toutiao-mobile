<template>
  <div class="update-name">
    <!-- 导航栏部分开始 -->
    <van-nav-bar
      title="编辑昵称"
      right-text="完成"
      left-arrow
      @click-left="close"
      @click-right="onConfirm"
    />
    <!-- 导航栏部分结束 -->

    <div class="updateInput">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="15"
        placeholder="请修改昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfileAPI } from '@/api/user'

export default {
  name: 'UpdateName',
  props: ['value'],
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })

      try {
        await updateUserProfileAPI({
          name: this.localName
        })
        this.$emit('close')
        // this.$emit('updateName', this.localName)
        // 发布input事件，更新父组件 v-model 绑定的数据
        this.$emit('input', this.localName)
        this.$toast.success('修改成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('用户名被占用')
        }
      }
    },
    close() {
      this.$emit('close')
      this.localName = this.value
    }
  }
}
</script>

<style lang='less' scoped>
</style>
