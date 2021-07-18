module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
      config.plugin('html').tap(args => {
          args[0].title = '【魔咔啦咔】茕茕孑立，生生不息'
          return args
      })
  },
  productionSourceMap: false,
}
