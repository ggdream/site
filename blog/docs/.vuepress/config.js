module.exports = {
    title: '魔咔啦咔的博博客',
    description: '一时间不知道何去何从',
    base: '/x/',
    themeConfig: {
        nav: [
            {
                text: '开源专区',
                items: [
                    {
                        text: 'OpenIM',
                        link: '/open/openim/',
                    },
                    {
                        text: 'Deve',
                        link: '/open/deve/',
                    },
                    {
                        text: 'SoftDB',
                        link: '/open/softdb/',
                    },
                ]
            },
            {
                text: '创作专区',
                link: '/create/',
            },
        ],
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
    // markdown: {
    //     lineNumbers: true
    // },
}
