import { RouteConfig } from 'vue-router'


const routes: Array<RouteConfig> = [
    {
        name: 'home',
        path: '/',
        component: () => import('@/views/home/Home.vue')
    },
    {
        name: 'about',
        path: '/about',
        component: () => import('@/views/about/About.vue')
    },
    {
        name: 'Join',
        path: '/join',
        component: () => import('@/views/join/Join.vue')
    },
    {
        name: 'create',
        path: '/create',
        component: () => import('@/views/create/Create.vue')
    },
    {
        name: 'app',
        path: '/app',
        component: () => import('@/views/app/App.vue')
    },
    {
        name: 'news',
        path: '/news',
        component: () => import('@/views/news/News.vue')
    },
    {
        name: 'open',
        path: '/open',
        component: () => import('@/views/open/Open.vue')
    },
]

export default routes
