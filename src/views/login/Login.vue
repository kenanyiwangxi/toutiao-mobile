<template>
  <div class="login-container">
    <van-nav-bar fixed :border="false" left-arrow placeholder
                 @click-left="$router.push($route.query.redirect || '/')"/>
    <div class="login-wrapper">
      <p class="title">短信登录</p>
      <div class="form">
        <!--
          基于Vant的表单验证：
          1、使用 van-form 组件包裹所有表单项 van-field
          2、给 van-form 绑定 submit 事件
            当表单提交时候会触发 submit 事件
            提示：只有表单验证通过，它才会用调用 submit 事件
          3、通过 rules 定义表单校验规则
        -->
        <van-form
          :show-error="false"
          :show-error-message="false"
          @submit="onLogin"
          @failed="onFailed"
          validate-first
          ref="login-form">
          <van-field
            v-model="user.mobile"
            placeholder="请输入手机号码"
            name="mobile"
            :rules="formRules.mobile"
          />
          <van-field
            v-model="user.code"
            placeholder="请输入验证码"
            name="code"
            :rules="formRules.code">
            <template #button>
              <van-count-down class="msg-btn" v-if="isCountDownShow" :time="1000 * 60" format="ss秒后获取"
                              @finish="isCountDownShow = false"/>
              <span class="msg-btn" v-if="!isCountDownShow">
                <span @click.prevent="onSendMsg" v-if="!isLoadingShow">发送验证码</span>
                <van-loading class="loading" size="16" v-if="isLoadingShow"/>
              </span>
            </template>
          </van-field>
          <div style="margin-top: 40px;">
            <van-button block type="info" native-type="submit" color="linear-gradient(to left, #ff6034, #ee0a24)">登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
    <div class="footer">
      <a href="javascript:">隐私条款</a>
    </div>
  </div>
</template>

<script>
import { loginAPI, sendMsgAPI } from '@/api/user'
import { mapMutations } from 'vuex'
// import { Toast } from 'vant'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号'
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮状态
      isLoadingShow: false
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    // 登录
    async onLogin() {
      this.$toast.loading({
        message: '登录中...', // 提示文字
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data: { data } } = await loginAPI(this.user)
        // 4.处理响应结果
        this.$toast.success('登录成功')
        // 5.将后端返回的用户登录状态(token等数据)放到Vuex容器中
        this.setUser(data)

        // 清除layout的缓存,让它重新渲染
        this.$store.commit('removeCachePage', 'Layout')

        // 跳转回原页面
        // this.$router.back()
        // 先用这种方式，但是不太好，有问题
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        this.$toast.fail('登录失败\n手机号或验证码错误')
      }
    },

    // 校验失败弹出提示
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top' // 防止手机键盘过高
        })
      }
    },

    // 发送验证码
    async onSendMsg() {
      // 校验手机号码
      // 验证通过 --> 请求发送验证码 --> 用户接收短信 --> 输入验证码 --> 请求登录
      // 请求发送验证码 --> 显示倒计时
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        // loading 状态，1.给用户反馈 2.防止网络慢用户多次点击触发发送行为
        this.isLoadingShow = true
        await sendMsgAPI(this.user.mobile)
        // 显示倒计时
        this.isCountDownShow = true
      } catch (error) {
        // try 里面任何代码错误都会进入catch
        // 不同的错误需要有不同的提示，那就需要判断了
        // 验证失败，提示错误信息
        let message = ''
        if (error && error.request && error.response.status === 429) {
          // 发送短信失败错误提示
          message = '发送太频繁,请稍后重试'
        } else if (error.name === 'mobile') {
          // 表单验证失败
          message = error.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top' // 防止手机键盘过高
        })
      }
      this.isLoadingShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  position: relative;

  /deep/ .van-nav-bar .van-icon {
    color: #999;
    font-size: 36px;
  }

  .login-wrapper {
    padding: 0 60px;

    .title {
      font-size: 50px;
    }

    .form {
      padding-top: 80px;

      .van-cell {
        padding: 20px 0;

        &:after {
          left: 0;
          right: 0;
        }
      }

      /deep/ .van-field__button {
        display: flex;

        .msg-btn {
          color: #999;
          display: inline-block;
          //height: 100%;
          padding-left: 24px;
          border-left: 3px solid #ebedf0;
          cursor: pointer;
          overflow: hidden;

          //.loading {
          //  padding: 0 10px;
          //}
        }
      }

      .van-button--normal {
        letter-spacing: 8px;
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
      color: #3a3a3a;
    }
  }
}
</style>
