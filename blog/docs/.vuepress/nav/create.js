const beauty = {
    text: '美饰',
    items: [
        {
            text: '身材管理',
            link: '/create/beauty/thin',
        },
        {
            text: '表情管理',
            link: '/create/beauty/express',
        },
        {
            text: '衣服配色',
            link: '/create/beauty/color',
        },
    ],
}

const sketch = {
    text: '素描',
    link: '/create/sketch/',
}

const redis = {

}

module.exports = {
    text: '创作专区',
    link: '/create/',
    items: [beauty, sketch,]
}
