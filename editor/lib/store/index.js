import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'

import { find, chain, truncate } from 'lodash'

import user from './user'
import games from './games'
import components from './components'
import sources from './sources'

import persistence from './local_store_persistence'

Vue.use(Vuex)

const PersistToLocalStore = store => {
  store.subscribe((mutation, state) => {
    persistence.saveState(state)
  })
}

const EMPTY_STATE = { }

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',

  plugins: [PersistToLocalStore],

  state: EMPTY_STATE,

  modules: { user, games, components, sources },

  getters: {
    activeSource: (state, getters) => (getters.activeComponent || { }).source,

    activeSourceProperties: (state, getters) => {
      if(getters.activeSource) {
        return getters.sourceProperties(getters.activeSource)
      } else {
        return null
      }
    },

    activeSourcePropertyExamples: (state, getters) => (propertyName) => {
      let propertyIndex = getters.activeSourceProperties.indexOf(propertyName)

      return chain(getters.activeSource.data.values)
        .map((row) => row[propertyIndex])
        .compact()
        .slice(1, 4)
        .map((content) => truncate(content, { length: 24, separator: /,? +/ }))
        .join(', ')
      .value()
    }
  },

  mutations: { },

  actions: {
    loadStateFromDB(context, { idToken }) {
      console.log("Logging in ID:", idToken)

      let profile = persistence.loadProfile(idToken) || {}
      context.commit("setProfile", { profile })

      let games = persistence.loadGames(idToken) || []
      context.commit("setGames", { games })

      let sources = persistence.loadSources(idToken) || []
      context.commit("setSources", { sources })

      context.commit("authenticateAs", { idToken })
    },
  }
})

let idToken = persistence.loadIdToken()

if(idToken) {
  store.dispatch("loadStateFromDB", { idToken })
} else {
  //
}

export default store
