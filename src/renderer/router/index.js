import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('../pages/login.vue').default
    },
    {
      path: '/examination',
      component: () => import('../pages/examination.vue')
    },
  ]
})
