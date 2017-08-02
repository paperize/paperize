import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics' // Google Analytics

import store from './store'

Vue.use(VueRouter)

import Splash      from './pages/Splash.vue'
import GameManager from './pages/GameManager.vue'
import GameEditor  from './pages/GameEditor.vue'

const routes = [
  { path: '/',              name: 'splash',      component: Splash,      props: true },
  { path: '/games',         name: 'gameManager', component: GameManager, props: true },
  { path: '/games/:gameId',
    name: 'gameEditor',
    component: GameEditor,
    props: true,
    beforeEnter: (to, from, next) => {
      console.log('route beforeEnter', to.params)
      store.commit("setSelectedGame", { gameId: to.params.gameId })
      next()
    }
  }
]

var router = new VueRouter({ routes })

// Only track pageviews in production builds
if(process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-48330981-5',
    router
  })
}

export default router
