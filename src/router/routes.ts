import { RouteConfig } from 'vue-router'


const routes: Array<RouteConfig> = [
    {
        name: 'Home',
        path: '/',
        component: () => import('@/views/home/Home.vue')
    },
    {
        name: 'Collect',
        path: '/collect',
        component: () => import('@/views/collect/Collect.vue')
    },
    {
        name: 'Join',
        path: '/join',
        component: () => import('@/views/join/Join.vue')
    },
    {
        name: 'Create',
        path: '/create',
        component: () => import('@/views/create/Create.vue')
    },
    {
        name: 'News',
        path: '/news',
        component: () => import('@/views/news/News.vue')
    },
    {
        name: 'Open',
        path: '/open',
        component: () => import('@/views/open/Open.vue')
    },
]

export default routes
