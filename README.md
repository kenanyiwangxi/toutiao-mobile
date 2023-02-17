# toutiao-m

## 解决图片响应403

    使用no-referrer 在head 中添加
    <meta name="referrer" content="no-referrer">

## 解决后端返回数据中的大数字问题

    JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值，这使得 JavaScript 不适合进行科学和金融方面的精确计算。

    json-bigint 是一个第三方包，它可以帮我们很好的处理这个问题。

第一步 安装下载第三方包

```
npm i json-bigint
```

第二步 导入第三方包

```
import jsonBig from 'json-bigint'
```

第三步 使用第三方包

```

const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/', // 接口基础路径
 
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [function(data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return jsonBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
    }]
```

## markdown-css 样式

网址： https://github.com/sindresorhus/github-markdown-css

## rem适配

如果需要使用 rem 单位进行适配，推荐使用以下两个工具：

postcss-pxtorem 是一款 PostCSS 插件，用于将 px 单位转化为 rem 单位
lib-flexible 用于动态设置 rem 基准值
详情请参考 Vant 的官方文档：https://vant-contrib.gitee.io/vant/#/zh-CN/advanced-usage#rem-bu-ju-gua-pei

### 1.1 配置 postcss-pxtorem

是一款 PostCSS 插件，用于将 px 单位转化为 rem 单位
1 .运行如下的命令：

```
npm install postcss-pxtorem
```

2.在 vue 项目根目录下，创建 postcss 的配置文件 postcss.config.js，并初始化如下的配置：

```
module.exports = {
plugins: {
    'postcss-pxtorem': {
        rootValue: 37.5, // 根节点的 font-size 值
        propList: ['*'] // 要处理的属性列表，* 代表所有属性
        }
    }
}
```

3.关于 px -> rem 的换算：

```
iphone6

375px = 10rem
37.5px = 1rem
1px = 1/37.5rem
12px = 12/37.5rem = 0.32rem
```

### 1.2 配置 amfe-flexible

用于设置 rem 基准值
1.运行如下的命令：

```
npm i amfe-flexible
```

2.在 main.js 入口文件中导入 amfe-flexible：

```
import 'amfe-flexible'
```

注意：当配置完 postcss-pxtorem 和 amfe-flexible 之后，要重启打包的服务器！

## axios使用

1.安装：

```
npm i axios
```

2.在 src 目录之下，创建 utils 子目录，并在 utils 目录下新建 request.js 网络请求模块如下：

```
import axios from 'axios'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

export default instance
```

## 轻松实现平滑滚动效果

1.运行如下的命令，安装 popmotion 这个依赖包：

```
npm install popmotion@9.3.5 -S
```

2.在组件中，从 popmotion 中按需导入 animate 函数：

```
从 popmotion 中按需导入 animate 动画函数
import { animate } from 'popmotion'
```

3.在组件中，为组件绑定点击事件处理函数：

```
<van-icon name="comment-o" size="20" @click="scrollToCmtList" />
```

4.在组件的 methods 节点下声明 scrollToCmtList 方法：

```
// 滚动到评论的列表区域
scrollToCmtList() {
  // 1. 当前滚动条的位置
  const now = window.scrollY
  // 2. 目标位置（文章信息区域的高度）
  const dist = document.querySelector('.article-container').offsetHeight

  // 3. 实现滚动动画
  animate({
    from: now, // 当前的位置
    to: dist,  // 目标位置
    onUpdate: latest => window.scrollTo(0, latest)
  })
}
```

## 在组件上使用v-model

当你传递给子组件的数据既要使用又要修改，例如这里的name  
这种情况下我们可以使用 v-model 简写

    @updateName="user.name = $event"
    :name="user.name"

    v-model='user.name'
    默认传递一个名字叫 value 的数据 :value='user.name'  

    默认监听 input 事件 @input='user.name = $event'  

    v-model 的本质还是父子组件通信，它仅仅是简化了父组件的使用

注意：v-model只允许使用一次

## 属性绑定的sync修饰符

如果有多个数据需要保持同步， 使用 .sync 修饰符

    :gender="user.gender"
    @update-gender="user.gender = $event"
    :gender.sync='user.gender'
        相当于:
        :gender='user.gender'
        @update:gender='user.gender = $event'
        @update:属性名称='user.gender = $event'

我们一般把最常用的数据设计为 v-model 绑定，把不太常用的数据设计为 .sync

## 关于input文件提交表单

accept属性控制接收文件类型  :

    ```<input type="file" ref="input" accept="image/*">```

注意：为了解决相同文件不触发 change 事件,所以在这里手动清空清空 file 的value

得到blob(URL地址)数据：const blob = URL.createObjectURL(e.target.files[0])

得到文件对象:e.target.files[0]

如果要求 Content-Type是multipart/form-data,则一定要提交 FormData 数据对象，专门用于文件上传的，不能提交 {}，没用

```
const fd = new FormData()
fd.append('photo', this.file)
await updateUserPhotoAPI(fd)
```

## 使用图像裁切插件

官方网址:https://github.com/fengyuanchen/cropperjs

1.安装

```
npm install cropperjs
```

2.引入文件

```
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
```

3.使用

```
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
```

注意：裁切完图片发生改变后，需要进行特殊处理，也可以为该组件设置v-if让其重新渲染

## WebSocket介绍

webSocket是一种数据通信协议，也是用于客户端和服务端数据通信，类似于我们常见的http

既然有http，为啥还要WebSocket  
http通信是单向的

* 请求 + 响应
* 没有请求也就没有响应

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用“轮询”：每隔一段时间，就发出一个询问，了解服务器有没有新的信息，最典型的场景就是聊天室

轮询的效率低，非常浪费资源(因为必须不停链接，或者HTTP链接始终打开)

因此WebSocket就是这样发明的。

websocket 相比于 HTTP 的优势  
HTTP 协议：客户端与服务器建立通信连接之后，服务器端只能被动地响应客户端的请求，无法主动给客户端发送消息。  
websocket 协议：客户端与服务器建立通信连接之后，服务器端可以主动给客户端推送消息了！！！

websocket 主要的应用场景  
需要服务端主动向客户端发送数据的场景，比如我们现在要做的智能聊天

其他特点包括：

1. 和HTTP一样属于应用层协议，也是建立在TCP协议之上，服务器端的实现比较容易
2. 与HTTP协议有着良好的兼容性，默认端口也是80和443，并且握手阶段(第1次建立链接)采用HTTP协议，因此握手时不容易屏蔽，能通过各种HTTP代理服务器
3. 数据格式比较轻量，性能开销小，通信高效
4. 可以发送文本，也可以发送二进制数据
5. 没有同源跨域限制，客户端可以与任意服务器通信
6. 协议标识符是 ws(如果加密,则为wss),服务器网址就是URL
7. 浏览器专门为WebSocket通信提供了一个请求对象WebSocket

注意：WebSocket不是用来代替HTTP的，它是用来解决实时通信的业务场景,如果业务不需要实时性，那就没必要使用WebSocket  
WebSocket也是有资源消耗，因为它要实时通信，也是需要和服务端保持一定的通信链接  
WebSocket也是需要服务端配合才能使用

在线测试通信接口：wss://echo.websocket.org

## Socket.IO

介绍：

* 原生的WebSocket使用比较麻烦，所以推荐使用一个封装好的解决方案：socket.io
* socket.io提供了服务端+客户端的实现
    * 客户端：浏览器
    * 服务端：JAVA、Python、PHP...Node.js
* 对于前端开发者来说,只需要关心她的客户端如何使用即可
* 注意：Socket.io必须前后端配套使用
    * 实际工作中，socket.io已经成为了各大后端开发的WebSocket通信主流解决方案

GitHub仓库：https://github.com/socketio/socket.io
JS使用:https://github.com/socketio/socket.io-client

### 开始使用

1.安装

```
 npm install weapp.socket.io
```

2.引入

```
import { io } from 'socket.io-client'
```

3.建立连接

```
const socket = io("http://toutiao.itheima.net");
```

## 动态控制缓存

keep-alive:主要用于保留组件状态或避免重新渲染，当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁他们。

* include和exclude属性允许组件有条件地缓存，二者都可以用逗号分隔字符串、正则表达式或一个数组来表示

1.将需要缓存的组件放到vuex中

```
cachePages: ['Layout']
```

2.配置动态控制方法(mutations)
`    // 添加缓存页面
addCachePage(state, pageName) {
if (!state.cachePages.includes(pageName)) {
state.cachePages.push(pageName)
}
},`

    // 移除缓存页面
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }

3.在登录成功后移除缓存页面
`// 清除layout的缓存,让它重新渲染
this.$store.commit('removeCachePage', 'Layout')`

4.在需要缓存的组件中挂载时添加缓存
`mounted() {
this.$store.commit('addCachePage', 'Layout')
}`

## 解决缓存带来的滚动位置问题

1.在需要保存滚动位置的组件中记录滚动距离
`data() {
return {
scrollTop: 0 // 列表滚动到顶部的距离
}
}`

2.当组件成功挂载时绑定滚动事件，并赋值给data中的值
`mounted() {
const articleList = this.$refs['article-list']
articleList.addEventListener('scroll', debounce(() => {
this.scrollTop = articleList.scrollTop
}, 50))
},`

3.当缓存的组件被激活时，设置滚动距离为data中的值
`// 缓存的组件被激活 没有缓存不会调用
activated() {
// 把记录到顶部的距离重新设置回去
this.$refs['article-list'].scrollTo(0, this.scrollTop)
},`

## 使用响应拦截器统一处理请求失败信息

```
// 响应拦截器
request.interceptors.response.use(function(response) {
// 响应成功进入这里
return response
}, async function(error) {
// 请求响应失败进入这里
// 超过2xx的状态码都会进入这里
const status = error.response.status
if (status === 400) {
// 客户端请求参数错误
Toast.fail('客户端请求参数异常')
} else if (status === 401) {
// token 无效
// 如果没有 user 或 user.token 直接去登录
} else if (status === 403) {
// 没有权限操作
Toast.fail('没有权限操作')
} else if (status >= 500) {
// 服务端异常
Toast.fail('服务端异常，请稍后重试')
}
return Promise.reject(error)
})
```

## 解决token过期

```
// 刷新用户token请求
const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})


...else if (status === 401) {
    // token 无效
    // 如果没有 user 或 user.token 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转登录页面
      return redirectLogin()
    }
    // 如果有 refresh_token,则请求获取新的 token
    try {
      const { data: { data } } = await refreshTokenReq({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      //  拿到新的 token 之后把它更新到容器中
      user.token = data.token
      store.commit('setUser', user)

      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 这里使用 request 发请求，它会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 数据
      return request(error.config)
    } catch (err) {
      // 刷新失败跳转回登录页面
      redirectLogin()
    }
    
    function redirectLogin() {
  router.replace({
    name: 'Login',
    // 传递查询参数,查询参数会以 ？ 作为分隔符放到url后面
    query: {
      // 数据名是随便起的
      // router.currentRoute 和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}
```

## 登录成功跳转回原页面

```
 function redirectLogin() {
  router.replace({
    name: 'Login',
    // 传递查询参数,查询参数会以 ？ 作为分隔符放到url后面
    query: {
      // 数据名是随便起的
      // router.currentRoute 和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
  }
  
  在登录组件中使用
  // 跳转回原页面
  // this.$router.back()
  // 先用这种方式，但是不太好，有问题
  this.$router.push(this.$route.query.redirect || '/')
```
