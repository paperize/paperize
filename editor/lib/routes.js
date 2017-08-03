import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics' // Google Analytics

import store from './store'

Vue.use(VueRouter)

import Splash      from './pages/Splash.vue'
import GameManager from './pages/GameManager.vue'
import GameEditor  from './pages/GameEditor.vue'

const routes = [
  {
    path:      '/',
    name:      'splash',
    component: Splash,
    props:     true
  }, {
    path:      '/games',
    name:      'gameManager',
    component: GameManager,
    props:     true,
    meta:      { requiresAuth: true }
  }, { 
    path:      '/games/:gameId',
    name:      'gameEditor',
    component: GameEditor,
    props:     true,
    meta:      { requiresAuth: true },
    beforeEnter(to, from, next) {
      store.dispatch("setSelectedGame", { gameId: to.params.gameId })
      next()
    }
  }
]

var router = new VueRouter({ routes })

// Authentication hook based on meta fields
router.beforeEach((to, from, next) => {
  // If auth is required...
  if(to.matched.some(record => record.meta.requiresAuth)) {
    // ...and we're not authed...
    if(!store.state.authenticated) {
      // ...redirect to the splash page...
      next({ name: 'splash' })
    } else {
      // ...but if we are authed, continue.
      next()
    }
  // Otherwise, we're required NOT to be authed, but we are...
  } else if(store.state.authenticated) {
    // ...redirect to the user home page...
    next({ name: 'gameManager' })
  } else {
    // ...otherwise continue.
    next()
  }
})

// Only track pageviews in production builds
if(process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-48330981-5',
    router
  })
}

export default router
