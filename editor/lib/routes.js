import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

Vue.use(VueRouter)

import Splash      from './components/SplashPage.vue'
import GameManager from './components/game/GameManagerPage.vue'
import GameEditor  from './components/game/GameEditorPage.vue'

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

// Things to enable in production
if(process.env.NODE_ENV === 'production') {

}

export default router
