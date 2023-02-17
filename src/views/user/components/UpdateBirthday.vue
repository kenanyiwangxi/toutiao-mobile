<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="编辑生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="close"
      @confirm="onConfirm"
      swipe-duration="500"
    />
  </div>
</template>

<script>
import { updateUserProfileAPI } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: ['value'],
  data() {
    return {
      // 最小可选日期 月份加1
      minDate: new Date(1900, 0, 1),
      // 最大可选日期 月份加1
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.currentDate = new Date(this.value)
    },
    async onConfirm(value) {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      await updateUserProfileAPI({
        birthday: dayjs(value).format('YYYY-MM-DD')
      })
      this.$emit('close')
      // this.$emit('updateName', this.localName)
      // 发布input事件，更新父组件 v-model 绑定的数据
      this.$emit('input', dayjs(value).format('YYYY-MM-DD'))
      this.$toast.success('修改成功')
    }
  }
}
</script>

<style lang='less' scoped>
.update-birthday {
  /deep/ .van-picker__confirm {
    color: #fc6627;
  }
}
</style>
