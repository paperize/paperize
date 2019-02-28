/* global process */
import { keys, pick } from 'lodash'

import Vue  from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user       from './user'
import database   from './database'
import ui         from './ui'
import folders    from './folders'
import sheets     from './sheets'
import images     from './images'
import games      from './games'
import components from './components'
import sources    from './sources'
import templates  from './templates'
import layers     from './layers'
import dimensions from './dimensions'
import print      from './print'
import uiPrint    from './ui_print'
import google     from './google'


const INITIAL_STATE = {
  user:       user.state,
  database:   database.state,
  ui:         ui.state,
  folders:    folders.state,
  sheets:     sheets.state,
  images:     images.state,
  games:      games.state,
  components: components.state,
  sources:    sources.state,
  templates:  templates.state,
  layers:     layers.state,
  dimensions: dimensions.state,
  print:      print.state,
  uiPrint:    uiPrint.state,
  google:     google.state,
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

  modules: {
    user,
    database,
    ui,
    uiPrint,
    folders,
    sheets,
    images,
    games,
    components,
    sources,
    templates,
    layers,
    dimensions,
    print,
    google
  },

  mutations: {
    resetState(state, newState={}) {
      // Create an empty default state from scratch
      let initialState = newInitialState(),
        // Wash the given state of any unexpected top-level keys
        groomedNewState = pick(newState, keys(initialState))
      // Overwrite the store's state
      Object.assign(state, { ...initialState, ...groomedNewState })
    }
  },

  actions: {
    // These are hacks to make routes work better
    // TODO: make routes work better without hacks
    whenStoreReady() {
      return INITIALIZATION_PROMISE
    },

    setStoreReady() {
      initResolve()
    }
  }
})

store.subscribe((mutation, state) => {
  ui.subscribe(store, mutation, state)
})


export default store
