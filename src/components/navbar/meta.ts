interface RouteMap {
    label: string;
    to: string;
}

const map: Array<RouteMap> = [
    {
        label: '关于我滴',
        to: '/about'
    },
    {
        label: '最新动态',
        to: '/news'
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
