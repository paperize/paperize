import Promise from 'bluebird'
import Vue  from 'vue'
import Vuex from 'vuex'

import user       from './user'
import games      from './games'
import components from './components'
import sources    from './sources'
import templates  from './templates'
import layers     from './layers'
import assets     from './assets'
import google     from './google'
import ui         from './ui'

Vue.use(Vuex)

const INITIAL_STATE = {
  user:       user.state,
  games:      games.state,
  components: components.state,
  sources:    sources.state,
  templates:  templates.state,
  layers:     layers.state,
  assets:     assets.state,
  google:     google.state,
  ui:         ui.state,
}

// Feeling hacky here, but having trouble with Observers contaminating my statics
const newInitialState = () => {
  return JSON.parse(JSON.stringify(INITIAL_STATE))
}

// A hack to stop things from querying the store before it's ready
let initResolve = null
const INITIALIZATION_PROMISE = new Promise((resolve) => {
  initResolve = resolve
})

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',
  // All state established inside modules
  state: newInitialState(),
  modules: { user, games, components, sources, templates, layers, assets, google, ui },
  mutations: {
    resetState(state, newState={}) {
      Object.assign(state, { ...newInitialState(), ...newState })
    }
  },

  actions: {
    whenStoreReady() {
      return INITIALIZATION_PROMISE
    },

    setStoreReady() {
      initResolve()
    }
  }
})

export default store
