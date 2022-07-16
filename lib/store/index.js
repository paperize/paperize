import { keys, pick } from 'lodash'

import Vue  from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user         from './user'
import database     from './database'
import cache        from './cache'
import env           from './env'
import ui           from './ui'
import folders      from './folders'
import spreadsheets from './spreadsheets'
import images       from './images'
import fonts        from './fonts'
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
  fonts:        fonts.state,
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
  strict: import.meta.env.DEV,

  // All state established inside modules
  state: newInitialState(),

  modules: {
    user,
    database,
    cache,
    env,
    ui,
    uiPrint,
    folders,
    spreadsheets,
    images,
    fonts,
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

// Register the top-level error handlers for the errors module
Vue.config.errorHandler = (vueError) => {
  try {
    // Ensure Vue error matches what we expect
    const { name, message, stack } = vueError
    if(!name || !message || !stack) { throw new Error("Abnormal Error") }

    // Unpack the Vue error into our error tracker
    store.dispatch("createError", {
      name: `Vue Error: ${name}`,
      message,
      details: stack
    })
  } catch(errorError) {
    store.dispatch("createError", {
      name: "Abnormal Vue Error",
      message: "",
      details: JSON.stringify(vueError, null, 2)
    })
  }
}

window.onerror = (message, url, lineNo, columnNo, globalError) => {
  try {
    // Ensure the error matches what we expect
    const { name, stack } = globalError
    if(!name || !stack) { throw new Error("Abnormal Error") }

    // Unpack the error event into our error tracker
    store.dispatch("createError", {
      name: `Global Error: ${name}`,
      message,
      details: stack
    })
  } catch(errorError) {
    store.dispatch("createError", {
      name: `Abnormal Global Error`,
      message: "",
      details: `
        Message: ${message}
        URL: ${url}
        Line Number: ${lineNo}
        Column Number: ${columnNo}
        Error Object: ${JSON.stringify(globalError, null, 2)}
      `
    })
  }
}

window.addEventListener("unhandledrejection", (event) => {
  try{
    // Ensure the rejection matches what we expect
    const { name, message, stack } = event.detail.reason
    if(!name || !message || !stack) { throw new Error("Abnormal Error") }

    // Unpack the unhandled rejectione event into our error tracker
    store.dispatch("createError", {
      name: (name && `Rejection: ${name}`) || "Rejection",
      message: message,
      details: stack,
    })
  } catch(errorError) {
    store.dispatch("createError", {
      name: "Abnormal Rejection",
      message: "",
      details: JSON.stringify(event, null, 2)
    })
  }

  // event.preventDefault() // This stops it from hitting the console
})

export default store
