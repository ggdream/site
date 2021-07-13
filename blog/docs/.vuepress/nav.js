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

module.exports = [
    course,
    open,
    create,
]
