<template>
  <div class="user-profile">
    <!-- 导航栏部分开始 -->
    <MyHeader title="个人信息" border/>
    <!-- 导航栏部分结束 -->

    <van-cell-group>
      <van-cell title="头像" is-link center @click="$refs.input.click()">
        <template>
          <van-image
            width="26"
            height="26"
            round
            fit="cover"
            :src="user.photo"
          />
        </template>
      </van-cell>
      <!-- accept控制接收文件类型 -->
      <input
        type="file"
        ref="input"
        accept="image/*"
        hidden
        @change="onFileChange">
      <van-cell
        title="昵称"
        is-link
        center
        :value="user.name"
        @click="isEditNameShow = true"
      />
      <van-cell
        title="简介"
        is-link
        center
        @click="isEditIntroShow = true"
        :value="!user.intro ? '用户很懒，什么都没留下' : user.intro"
      />
      <div class="space"></div>
      <van-cell
        title="性别"
        is-link
        center
        @click="isEditGenderShow = true"
        :value="user.gender ? '女' : '男'"/>
      <van-cell
        title="生日"
        is-link
        center
        @click="isEditBirthdayShow = true"
        :value="user.birthday"/>
    </van-cell-group>

    <!-- 修改昵称 -->
    <van-popup
      v-model="isEditNameShow"
      position="right"
      :style="{width: '100%', height: '100%' }"
    >
      <!--
        当你传递给子组件的数据既要使用又要修改，例如这里的name
        这种情况下我们可以使用 v-model 简写
       -->
      <!--
        @updateName="user.name = $event"
        :name="user.name"
       -->

      <!--
          v-model='user.name'
          默认传递一个名字叫 value 的数据 :value='user.name'
          默认监听 input 事件 @input='user.name = $event'
          v-model 的本质还是父子组件通信，它仅仅是简化了父组件的使用
       -->

      <!--v-model 只能使用一次-->

      <!--
          如果有多个数据需要保持同步， 使用 .sync 修饰符
          :gender="user.gender"
          @update-gender="user.gender = $event"
            :gender.sync='user.gender'
            相当于:
              :gender='user.gender'
              @update:gender='user.gender = $event'
              @update:属性名称='user.gender = $event'
          我们一般把最常用的数据设计为 v-model 绑定，把不太常用的数据设计为 .sync
       -->
      <!--        v-if="isEditNameShow"-->
      <UpdateName
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>

    <!-- 简介 -->
    <van-popup
      v-model="isEditIntroShow"
      position="right"
      :style="{width: '100%', height: '100%' }"
    >
      <UpdateIntro
        v-model="user.intro"
        @close="isEditIntroShow = false"
      />
    </van-popup>

    <!-- 性别 -->
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
      @close="$refs.gender.defaultIndex = user.gender"
    >
      <UpdateGender
        ref="gender"
        v-model='user.gender'
        @close="isEditGenderShow = false"/>
    </van-popup>

    <!-- 生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
      @close="$refs.birthday.currentDate = new Date(user.birthday)"
    >
      <UpdateBirthday
        ref="birthday"
        @close="isEditBirthdayShow = false"
        v-model="user.birthday"/>
    </van-popup>

    <!-- 头像 -->
    <van-popup
      v-model="isEditPhotoShow"
      position="bottom"
      style="height: 100%"
      class="update-photo-popup"
    >
      <UpdatePhoto v-if="isEditPhotoShow" @updatePhoto="user.photo = $event" @close="isEditPhotoShow = false"
                   :file="previewImage"/>
    </van-popup>

    <div class="footer">
      <a href="javascript:">隐私条款</a>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue'
import UpdateName from '@/views/user/components/UpdateName.vue'
import UpdateIntro from '@/views/user/components/UpdateIntro.vue'
import UpdateGender from '@/views/user/components/UpdateGender.vue'
import UpdateBirthday from '@/views/user/components/UpdateBirthday.vue'
import UpdatePhoto from '@/views/user/components/UpdatePhoto.vue'
import { getUserProfileAPI } from '@/api/user'

export default {
  name: 'UserProfile',
  components: {
    MyHeader,
    UpdateName,
    UpdateIntro,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称显示状态
      isEditIntroShow: false, // 编辑简介显示状态
      isEditGenderShow: false, // 编辑性别显示状态
      isEditBirthdayShow: false, // 编辑生日显示状态
      isEditPhotoShow: false, // 编辑头像显示状态
      previewImage: null // 上传预览图片
    }
  },
  methods: {
    async loadUserProfile() {
      const { data: { data } } = await getUserProfileAPI()
      this.user = data
    },
    onFileChange(e) {
      // 在弹出层里面预览图片
      // this.previewImage = URL.createObjectURL(e.target.files[0])
      this.previewImage = e.target.files[0]
      // 展示弹出层
      this.isEditPhotoShow = true
      // 为了解决相同文件不触发 change 事件,所以在这里手动清空清空 file 的value
      this.$refs.input.value = ''
    }
  },
  created() {
    this.loadUserProfile()
  }
}
</script>

<style lang='less' scoped>
.user-profile {
  height: 100vh;

  .space {
    width: 100%;
    height: 28px;
    background-color: #f8f8f8;
  }

  .van-cell {
    .van-cell__value {
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .van-image {
        margin-left: auto;
      }
    }
  }

  .footer {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100px;
    font-size: 28px;

    a {
      color: #fc6627;
    }
  }

  .van-popup {
    background-color: #f8f8f8 !important;

    /deep/ .van-nav-bar .van-icon {
      color: #999;
      font-size: 36px;
    }

    /deep/ .van-nav-bar__text {
      color: #fc6627;
    }

    /deep/ .updateInput {
      padding: 32px;

      .van-cell {
        border-radius: 8px;
      }
    }
  }

  .update-photo-popup {
    background-color: #000 !important;
    display: flex;
    align-items: center;
  }
}
</style>
