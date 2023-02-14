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
