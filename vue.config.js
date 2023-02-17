const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
  // devServer: {
  //   proxy: {
  //     '/ws': {
  //       target: 'http://toutiao.itheima.net/',
  //       pathRewrite: { '^/ws': '' },
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
})
