module.exports = {
<<<<<<< HEAD
  //publicPath: '/virtual-school/',
  //publicPath: '/',
  publicPath: '/venue/',
=======
  //publicPath: '/',
  publicPath: '/virtual-school/',
  outputDir:'dist',
  assetsDir:'dkhasset',
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
  "transpileDependencies": [
    "vuetify"
  ],

 // https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
  css: {
    loaderOptions: {
      // pass options to sass-loader
      // @/ is an alias to src/
      // so this assumes you have a file named `src/variables.sass`
      // Note: this option is named as "prependData" in sass-loader v8
      sass: {
        // prependData: `@import "~@/assets/variables.sass"`
      },
      // by default the `sass` option will apply to both syntaxes
      // because `scss` syntax is also processed by sass-loader underlyingly
      // but when configuring the `prependData` option
      // `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
      // in that case, we can target the `scss` syntax separately using the `scss` option
      //scss: {
        // prependData: `@import "./src/assets/variables.scss";`
      //},

      // pass Less.js Options to less-loader
      less:{
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      }
    }
  },

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