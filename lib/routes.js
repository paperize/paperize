import { map } from 'lodash'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

Vue.use(VueRouter)

import Threshold   from './components/threshold/Threshold.vue'
import GameManager from './components/game/GameManagerPage.vue'
import GameEditor  from './components/game/GameEditorPage.vue'

let routerMode = ""

const
  activeRoutes = [
    {
      path:      '/',
      name:      'threshold',
      component: Threshold,
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
  ],

  emptyRoutes = map(activeRoutes, (route) => {
    // overwrite all routes to:
    return {
      ...route,
      // show threshold
      component: Threshold,
      // not require login
      meta: {},
      beforeEnter: (to, from, next) => next()
    }
  }),

  router = new VueRouter(),

  // Yuck, vue-router has something against letting us delete routes
  // Workaround: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  activeRouterMatcher = new VueRouter({ routes: activeRoutes }).matcher,
  emptyRouterMatcher = new VueRouter({ routes: emptyRoutes }).matcher,

  setRouterEmptyMode = () => {
    router.matcher = emptyRouterMatcher
    routerMode = "empty"
  },

  setRouterActiveMode = () => {
    router.matcher = activeRouterMatcher
    routerMode = "active"
  }

// Start in empty mode
setRouterEmptyMode()

// Authentication hook based on meta fields
router.beforeEach((to, from, next) => {
  if(routerMode === "empty") { return next() }

  store.dispatch("whenStoreReady").then(() => {
    // If auth is required...
    if(to.matched.some(record => record.meta.requiresAuth)) {
      // ...and we're not authed...
      if(!store.state.user.authenticated) {
        // ...redirect to the app threshold page...
        next({ name: 'threshold' })
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
})

// Per-route beforeEnter hooks aren't called if the component is re-used,
// so just check if we're hitting those routes from here.
router.beforeEach((to, from, next) => {
  if(routerMode === "empty") { return next() }

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
  if(type === 'become' && router.currentRoute.name === 'threshold') {
    router.push({ name: 'gameManager' })

  } else if(type === 'destroyGame') {
    router.push({ name: 'gameManager' })

  } else if(type === 'createComponent') {
    router.push({ name: 'componentEditor', params: { gameId: state.ui.activeGameId, componentId: payload.id } })

  } else if(type === 'destroyComponent' && router.currentRoute.name === 'threshold') {
    // if we just destroyed the component we're editing, route back up to gameEditor
    router.push({ name: 'gameEditor', params: { gameId: state.ui.activeGameId }})
  }
})

export default router

export { setRouterEmptyMode, setRouterActiveMode }
