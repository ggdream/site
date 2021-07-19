module.exports = {
    productionSourceMap: false,
    transpileDependencies: [
        'vuetify'
    ],
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = '【魔咔啦咔】茕茕孑立，生生不息'
            return args
        })
        config.when(process.env.NODE_ENV === 'production', config => {
            config.optimization.minimizer('terser').tap((args) => {
                args[0].terserOptions.compress.drop_console = true
                return args
            })
        })
    },
}
