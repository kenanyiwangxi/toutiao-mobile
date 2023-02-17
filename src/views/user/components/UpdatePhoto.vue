<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image" alt="">
    <van-nav-bar
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhotoAPI } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdatePhoto',
  props: ['file'],
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 展示时间无限制,持续展示
      })

      // 使用裁切后的图片
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 如果要求 Content-Type是multipart/form-data,则一定要提交 FormData 数据对象，专门用于文件上传的，不能提交 {}，没用
      // const fd = new FormData()
      // fd.append('photo', this.file)
      await updateUserPhotoAPI(fd)

      // 更新父组件中的用户头像
      this.$emit('updatePhoto', window.URL.createObjectURL(file))
      // 关闭弹出层
      this.$emit('close')
      this.$toast.success('保存成功')
    },
    getCroppedCanvas() {
      // 获取裁切过后的图片blob数据
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(file => {
          resolve(file)
        })
      })
    }
  },
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      // 视图模式 1：限制裁剪框不超过画布的大小。
      viewMode: 1,
      // 拖动模式 move:移动画布
      dragMode: 'move',
      // 纵横比 1：1比1 定义裁剪框的固定纵横比。默认情况下，裁剪框具有自由比率。
      aspectRatio: 1,
      // 裁剪框是否可移动 启用以通过拖动移动裁剪框
      cropBoxMovable: false,
      // 裁剪框是否可调整大小 启用以通过拖动来调整裁剪框的大小
      cropBoxResizable: false,
      // 背景 显示容器的网格背景
      background: false,
      // 是否可以移动图像
      movable: true
    })
  }
}
</script>

<style lang='less' scoped>
.update-photo {
  .van-nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;

    /deep/ .van-nav-bar__text {
      color: #fff !important;
    }
  }

  /* Ensure the size of the image fit the container perfectly */

  .image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 100%;
  }

}
</style>
