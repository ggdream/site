interface RouteMap {
    label: string;
    to: string;
}

const map: Array<RouteMap> = [
    {
        label: '最新动态',
        to: '/news'
    },
    {
        label: '教程收录',
        to: '/collect'
    },
    {
        label: '开源专区',
        to: '/open'
    },
    {
        label: '创作专区',
        to: '/create'
    },
    {
        label: '交流合作',
        to: '/join'
    },
]

export default map
