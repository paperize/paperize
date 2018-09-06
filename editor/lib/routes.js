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
    meta:      { requiresAuth: true },
    beforeEnter(to, from, next) {
      store.dispatch("clearActiveGame")
      next()
    }
  }, {
    path:      '/games/:gameId',
    name:      'gameEditor',
    component: GameEditor,
    props:     true,
    meta:      { requiresAuth: true },
  }, {
    path:      '/games/:gameId/components/:componentId',
    name:      'componentEditor',
    component: GameEditor,
    props:     true,
    meta:      { requiresAuth: true }
  }
]

var router = new VueRouter({ routes })

// Authentication hook based on meta fields
router.beforeEach((to, from, next) => {
  // If auth is required...
  if(to.matched.some(record => record.meta.requiresAuth)) {
    // ...and we're not authed...
    if(!store.state.user.authenticated) {
      // ...redirect to the splash page...
      next({ name: 'splash' })
    } else {
      // ...but if we are authed, continue.
      next()
    }
  // Otherwise, we're required NOT to be authed, but we are...
  } else if(store.state.user.authenticated) {
    // ...redirect to the user home page...
    next({ name: 'gameManager' })
  } else {
    // ...otherwise continue.
    next()
  }
})

// Per-route beforeEnter hooks aren't called if the component is re-used,
// so just check if we're hitting those routes from here.
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.name == "gameEditor")) {
    store.dispatch("whenStoreReady").then(() => {
      store.dispatch("setActiveGame", to.params.gameId)
      next()
    })
  } else if(to.matched.some(record => record.name == "componentEditor")) {
    store.dispatch("whenStoreReady").then(() => {
      store.dispatch("setActiveGame", to.params.gameId)
      store.dispatch("setActiveComponent", to.params.componentId)
      next()
    })
  } else {
    next()
  }
})

// Auto-route on certain Store mutations
store.subscribe(({ type, payload }, state) => {
  if(type === 'become' && router.currentRoute.name === 'splash') {
    router.push({ name: 'gameManager' })

  } else if(type === 'resetState') {
    // No reason to be at a non-root URL if we're resetting state
    router.push({ name: 'gameManager' })

  } else if(type === 'logout') {
    router.push({ name: 'splash' })

  } else if(type === 'createGame') {
    router.push({ name: "gameEditor", params: { gameId: payload.id }})

  } else if(type === 'destroyGame') {
    router.push({ name: 'gameManager' })

  } else if(type === 'createComponent') {
    router.push({ name: 'componentEditor', params: { gameId: state.ui.activeGameId, componentId: payload.id } })

  } else if(type === 'destroyComponent') {
    router.push({ name: 'gameEditor', params: { gameId: state.ui.activeGameId }})
  }
})

export default router
