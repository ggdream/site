module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
      config.plugin('html').tap(args => {
          args[0].title = '【魔咔啦咔】我们都一样，被灌输了太多泡沫'
          return args
      })
  },
  productionSourceMap: false,
}
