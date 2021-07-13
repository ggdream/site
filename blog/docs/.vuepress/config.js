const course = {
    text: '教程中心',
    link: '/course/',
    items: [
        {
            text: 'SCSS',
            link: '/course/scss/',
            items: [
                {
                    text: '1.相关介绍',
                    link: '/course/scss/1',
                },
                {
                    text: '2.环境配置',
                    link: '/course/scss/2',
                },
                {
                    text: '3.SassScript',
                    link: '/course/scss/3',
                },
            ],
        }
    ],
}

const open = {
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
}

const create = {
    text: '创作专区',
    link: '/create/',
}


module.exports = {
    title: '魔咔啦咔的博博客',
    description: '穿行丁字路口同样需要地图',
    base: '/x/',
    dest: '../public/x',
    themeConfig: {
        nav: [
            course,
            open,
            create,
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
