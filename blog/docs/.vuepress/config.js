module.exports = {
    title: '魔咔啦咔的博博客',
    description: '💜',
    base: '/x/',
    dest: '../public/x',
    themeConfig: {
        nav: require('./nav'),
        sidebar: 'auto',
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ['@vuepress/nprogress'],
    ],
    locales: {
        '/': {
            lang: 'zh-CN',
        }
    },
}
