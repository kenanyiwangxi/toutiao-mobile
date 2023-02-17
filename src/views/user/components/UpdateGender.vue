<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="编辑性别"
      :columns="columns"
      @cancel="close"
      @confirm="onConfirm"
      @change="onChange"
      :default-index="defaultIndex"
      swipe-duration="500"
    />
  </div>
</template>

<script>
import { updateUserProfileAPI } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: ['value'],
  data() {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  methods: {
    onChange(picker, value, index) {
      this.defaultIndex = index
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      await updateUserProfileAPI({
        gender: this.defaultIndex
      })
      this.$emit('close')
      // this.$emit('updateName', this.localName)
      // 发布input事件，更新父组件 v-model 绑定的数据
      this.$emit('input', this.defaultIndex)
      this.$toast.success('修改成功')
    },
    close() {
      this.$emit('close')
      this.defaultIndex = this.value
    }
  }
}
</script>

<style lang='less' scoped>
.update-gender {
  /deep/ .van-picker__confirm {
    color: #fc6627;
  }
}
</style>
