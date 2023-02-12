<template>
  <div>
    <van-cell>
      <template #title>
        <div class="title-box">
          <!-- 文章标题 -->
          <span>{{ item.title }}</span>
          <!-- 单张图片 -->
          <img v-if="item.cover.type === 1" v-lazy="item.cover.images[0]" alt="" class="picture">
        </div>
        <!-- 三张图片 -->
        <div class="picture-box" v-if="item.cover.type === 3">
          <img v-for="(pic,index) in item.cover.images" v-lazy="pic" alt="" :key="index" class="picture">
        </div>
      </template>
      <template #label>
        <div class="label-box">
                <span>{{ item.aut_name }} &nbsp;&nbsp; {{
                    item.comm_count
                  }}评论 &nbsp;&nbsp; {{ item.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈的动作面板 -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" get-container="body"
                      @closed="isAction = 0">
      <!-- 第一级反馈面板 -->
      <div v-if="isAction === 0">
        <van-cell v-for="item in actions" :key="item.name" :title="item.name" clickable
                  @click="onCellClick(item.name)" icon-prefix="toutiao" :icon="item.icon"/>
      </div>
      <!-- 第二级反馈面板 -->
      <div v-else-if="isAction === 1">
        <van-cell v-for="item in report" :key="item.type" :title="item.label" clickable class="center-title"
                  @click="reportArticle(item.type)"/>
      </div>
      <!-- 第三级反馈面板 -->
      <div v-else>
        <div class="describe">
          <p>其他问题描述</p>
          <van-form @submit="submitDes" :show-error-message="false">
            <van-field
              v-model.trim="describe"
              rows="4"
              autosize
              type="textarea"
              maxlength="100"
              placeholder="请输入问题描述"
              show-word-limit
              class="describe-input"
              :rules="[{ required: true, message: '请输入问题描述' }]"
            />
            <van-button block type="info" native-type="submit" color="linear-gradient(to left, #ff6034, #ee0a24)">
              提交
            </van-button>
          </van-form>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import report from '@/api/report'
import { dislikeArticleAPI, reportArticleAPI } from '@/api/article'

export default {
  name: 'ArtItem',
  props: ['item'],
  data() {
    return {
      show: false, // 控制反馈滑块状态
      actions: [ // 第一个面板的可选项列表
        {
          name: '不感兴趣',
          icon: 'buganxingqu_line'
        },
        {
          name: '反馈垃圾内容',
          icon: 'icon_jubao-xian'
        }
      ],
      isAction: 0, // 控制展示哪个面板的可选项列表 0:第一个面板 1:第二个面板 2:第三个面板
      report, // 举报文章选项
      describe: '' // 其他问题描述
    }
  },
  computed: {
    artId() {
      return this.item.art_id.toString()
    }
  },
  methods: {
    async onCellClick(name) {
      // 一级选项的点击事件处理函数
      if (name === '不感兴趣') {
        // 调用 API 接口，将文章设置为不感兴趣
        const { data: res } = await dislikeArticleAPI(this.artId)
        if (res.message === 'OK') {
          this.$emit('deleteActive', this.artId)
        }
        this.show = false
        this.$toast('操作成功!\n将推荐更符合你的内容')
      } else if (name === '反馈垃圾内容') {
        // 展示二级反馈面板
        this.isAction = 1
      }
    },
    reportArticle(type) {
      if (type === 0) {
        // 展示三级反馈面板
        this.isAction = 2
        return
      }
      this.handleReport(type)
    },
    submitDes() {
      this.handleReport(0)
    },
    async handleReport(type) {
      const { data: res } = await reportArticleAPI({
        target: this.artId,
        type,
        remark: this.describe
      })
      if (res.message === 'OK') {
        this.$emit('deleteActive', this.artId)
      }
      this.show = false
      this.describe = ''
      this.$toast('感谢告知! 我们将尽快处理')
    }
  }
}
</script>

<style lang='less' scoped>
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;

  span {
    flex: 1;
    padding-right: 32px;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 32px;
    color: #4d4d4d;
    line-height: 40px;
    letter-spacing: 2px;
  }
}

.picture {
  width: 226px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

.picture-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
}

.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center-title {
  text-align: center;
}

.toutiao-buganxingqu_line {
  font-size: 28px;
  margin-right: 4px;
}

.describe {
  padding: 32px;

  .describe-input {
    padding: 20px 0;
  }

  p {
    margin-bottom: 4px;
  }

  /deep/ .van-cell__value {
    background-color: #f4f4f4;
    padding: 24px;
    border-radius: 10px;
  }
}

</style>
