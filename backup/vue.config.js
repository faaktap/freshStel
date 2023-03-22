module.exports = {
  // publicPath: '/',
  publicPath: '/virtual-school/',
  outputDir:'dist',
  assetsDir:'zasset',
  "transpileDependencies": [
    "vuetify"
  ],


  //  chainWebpack: config => {
  //           config
  //               .plugin('html')
  //               .tap(args => {
  //                   args[0].chunksSortMode = function (chunk1, chunk2) {
  //                       const order = ['atten','admin', 'pers', 'email']
  //                       const order1 = order.indexOf(chunk1.names[0])
  //                       const order2 = order.indexOf(chunk2.names[0])
  //                       return order1 - order2
  //                   }
  //                   return args
  //               })
  //   },
}