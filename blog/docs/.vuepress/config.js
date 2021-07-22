module.exports = {
    title: '魔咔啦咔的博博客',
    description: '💜',
    base: '/x/',
    dest: '../public/x',
    themeConfig: {
        nav: require('./nav'),
        sidebar: 'auto',
        lastUpdated: '最新更新时间',
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ['@vuepress/nprogress'],
        ['@vuepress/last-updated'],
    ],
    locales: {
        '/': {
            lang: 'zh-CN',
        }
    },
}
