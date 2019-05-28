/* global process */
import { keys, pick } from 'lodash'

import Vue  from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user         from './user'
import database     from './database'
import cache        from './cache'
import ui           from './ui'
import folders      from './folders'
import spreadsheets from './spreadsheets'
import images       from './images'
import games        from './games'
import components   from './components'
import templates    from './templates'
import layers       from './layers'
import errors       from './errors'
import dimensions   from './dimensions'
import print        from './print'
import uiPrint      from './ui_print'
import google       from './google'


const INITIAL_STATE = {
  version:      "5.5a",
  user:         user.state,
  database:     database.state,
  cache:        cache.state,
  ui:           ui.state,
  folders:      folders.state,
  spreadsheets: spreadsheets.state,
  images:       images.state,
  games:        games.state,
  components:   components.state,
  templates:    templates.state,
  layers:       layers.state,
  errors:       errors.state,
  dimensions:   dimensions.state,
  print:        print.state,
  uiPrint:      uiPrint.state,
  google:       google.state,
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
    cache,
    ui,
    uiPrint,
    folders,
    spreadsheets,
    images,
    games,
    components,
    templates,
    layers,
    errors,
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

// Register subscriptions for modules with callbacks
store.subscribe((mutation, state) => {
  ui.subscribe(store, mutation, state)
  errors.subscribe(store, mutation, state)
})

// Register the global error handlers for the errors module
window.addEventListener("error", (event) => {
  // Unpack the error event into our error tracker
  store.dispatch("createError", {
    name: event.error,
    message: event.msg,
    details: `${event.filename} on line ${event.lineno} at ${event.colno}`
  })

  return true // This stops it from hitting the console
})

window.addEventListener("unhandledrejection", (event) => {
  // Unpack the unhandled rejectione event into our error tracker
  store.dispatch("createError", {
    name: "Promise Rejected",
    message: event.detail.reason.message,
    details: event.detail.reason.stack,
  })

  event.preventDefault() // This stops it from hitting the console
})

export default store
