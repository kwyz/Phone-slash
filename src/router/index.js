import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainPage/Index.vue')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('@/views/ConfigPage/Index.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('@/views/PlayPage/Index.vue')
    },
  ]
})
