const scss = {
    text: 'Scss',
    link: '/course/scss/',
    items: [
        {
            text: '① 相关介绍',
            link: '/course/scss/introduce',
        },
        {
            text: '② 环境配置',
            link: '/course/scss/env',
        },
        {
            text: '③ SassScript',
            link: '/course/scss/sassscript',
        },
    ],
}

const redis = {
    text: 'Redis',
    items: [
        {
            text: '😆 介绍与安装',
            link: '/course/redis/0.md',
        },
        {
            text: '① 基础数据类型命令',
            link: '/course/redis/1.md',
        },
        {
            text: '② 其他数据类型命令',
            link: '/course/redis/2.md',
        },
        {
            text: '③ 事务等特性支持',
            link: '/course/redis/3.md',
        },
        {
            text: '④ 集群与分布式',
            link: '/course/redis/4.md',
        },
        {
            text: '⑤ 底层数据结构源码解析',
            link: '/course/redis/5.md',
        },
        {
            text: '⑥ Go语言实现一个类Redis',
            link: '/course/redis/6.md',
        },
        {
            text: '⑦ 编程语言客户端',
            link: '/course/redis/7.md',
        },
        {
            text: '⑧ Redis的应用场景',
            link: '/course/redis/8.md',
        },
    ],
}

const sanic = {
    text: 'Sanic',
    link: '/course/sanic/',
    items: [
        {
            text: '① 基础知识',
            link: '/course/sanic/basic.md',
        },
        {
            text: '② 最佳实践',
            link: '/course/sanic/practice.md',
        },
    ],
}

module.exports = {
    text: '教程中心',
    link: '/course/',
    items: [
        scss,
        redis,
        sanic,
    ],
}
