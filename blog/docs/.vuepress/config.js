const nav = require('./nav')

module.exports = {
    title: '魔咔啦咔的博博客',
    description: '如果喜欢我就拥抱我。我都不怕，你怕什么',
    base: '/x/',
    dest: '../public/x',
    themeConfig: {
        nav,
        sidebar: 'auto',
    },
    plugins: [
        ['@vuepress/back-to-top'],
        ['@vuepress/nprogress'],
        '@vuepress/pwa',
        {
            serviceWorker: true,
            updatePopup: true,
        },
    ],
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
}
