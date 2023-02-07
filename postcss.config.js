/*
  PostCss 配置文件
  PostCss 是基于Node.js运行的一个处理 CSS 的工具
  所以它的配置文件也是运行在Node.js中
*/

// postcss.config.js
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    'postcss-pxtorem': {
      // 转换的根元素基准值
      // 正常情况下按照你的设计稿来
      // 750 宽的设计稿： 750 / 10 = 75
      // 375 宽的设计稿： 375 / 10 = 37.5
      // 移动端一般都是以 iphone 6/7/8 为原型设计的
      // Vant 组件库是基于逻辑像素 375 宽写的
      // 设计稿都是基于物理像素 750 宽设计的
      // 如果设置成75，那么我们可以在设计稿中测量多少就写多少，但是 Vant的样式就会变得很小，小了一半
      // 所以我们还必须设置为 37.5，但是在测量设计稿的时候我们必须让你的测量单位 / 2
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 需要转换的 CSS 属性，* 就是所有属性都要转换
      propList: ['*']
    }
  }
}
