import Vue from 'vue'
import VueRouter, {Route, NavigationGuardNext} from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext)=>{
    if (to.path === '/create' || to.path == '/open') {
        window.open('/x/')
        return;
    }
    next()
})

export default router
