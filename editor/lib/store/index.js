import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'

import { find, chain, truncate } from 'lodash'

import user from './user'
import games from './games'
import components from './components'
import sources from './sources'
import google from './google'

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

  modules: { user, games, components, sources, google },

  getters: { },

  mutations: { },

  actions: {
    loadStateFromDB(context, { idToken }) {
      console.log("Logging in ID:", idToken)

      let user = persistence.loadUser(idToken) || {}
      let games = persistence.loadGames(idToken) || []
      let sources = persistence.loadSources(idToken) || []

      context.commit("become", user)
      context.commit("setGames", games)
      context.commit("setSources", sources)
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
