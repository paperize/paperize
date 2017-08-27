import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'

import { find, chain } from 'lodash'

import persistence from './local_store_persistence'

Vue.use(Vuex)

const EMPTY_STATE = {
  idToken: null,
  authenticated: false,
  profile: {
    name: '',
    avatarSrc: ''
  },
  games: [],
  sources: [],
  selectedGame: null,
  activeComponent: null,
  activeSource: null
}

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',

  state: EMPTY_STATE,

  getters: {
    activeSourceProperties: (state) => state.activeSource.data.values[0],

    activeSourcePropertyExamples: (state, getters) => (propertyName) => {
      let propertyIndex = getters.activeSourceProperties.indexOf(propertyName)

      return chain(state.activeSource.data.values)
        .map((row) => row[propertyIndex])
        .compact()
        .slice(1, 4)
      .value()
    }
  },

  mutations: {
    logout (state) {
      state.authenticated = false
      state.idToken = null
      state.profile.name = ''
      state.profile.avatarSrc = ''

      persistence.saveState(state)
    },

    authenticateAs (state, { idToken }) {
      state.authenticated = true
      state.idToken = idToken

      persistence.saveState(state)
    },

    setProfile(state, { profile }) {
      state.profile = state.profile || {}
      state.profile.name = profile.name
      state.profile.avatarSrc = profile.avatarSrc

      persistence.saveState(state)
    },

    setGoogleToken(state, { token }) {
      state.googleToken = token
    },

    setGames (state, { games }) {
      state.games = games

      persistence.saveState(state)
    },

    setSources (state, { sources }) {
      state.sources = sources

      persistence.saveState(state)
    },

    createGame (state, { game }) {
      game.id = game.id || uuid()
      state.games.push(game)
      state.selectedGame = game

      persistence.saveState(state)
    },

    updateGame(state, { game: newGame }) {
      let foundGame = find(state.games, { id: newGame.id })
      if(foundGame === newGame){
        throw new Error("Game to update is same object in store!")
      }
      // Overwrites properties of found with new
      Object.assign(foundGame, newGame)

      persistence.saveState(state)
    },

    deleteGame (state, { game }) {
      state.games.splice(state.games.indexOf(game), 1)

      persistence.saveState(state)
    },

    setSelectedGame (state, { gameId }) {
      let foundGame = find(state.games, { id: gameId })
      if(!foundGame) {
        throw new Error(`No game found with id: ${gameId}`)
      }

      state.selectedGame = foundGame
    },

    createComponent(state, { component }) {
      component.id = component.id || uuid()
      state.selectedGame.components.push(component)

      persistence.saveState(state)
    },

    updateComponent(state, { component: newComponent }) {
      let foundComponent = find(state.selectedGame.components, { id: newComponent.id })
      if(foundComponent === newComponent){
        throw new Error("Component to update is same object in store!")
      }
      // Overwrites properties of found with new
      Object.assign(foundComponent, newComponent)

      persistence.saveState(state)
    },

    deleteComponent(state, { component }) {
      state.selectedGame.components.splice(state.selectedGame.components.indexOf(component), 1)
      if(state.activeComponent.id == component.id){
        state.activeComponent = null
      }
      persistence.saveState(state)
    },

    setActiveComponent(state, { component }) {
      let foundComponent = find(state.selectedGame.components, { id: component.id })
      if(!foundComponent) {
        throw new Error(`No component found: ${component}`)
      }

      state.activeComponent = foundComponent
    },

    createSource(state, { source }) {
      source.id = source.id || uuid()
      state.sources.push(source)
      state.activeSource = source
    },

    setActiveSource(state, { source }) {
      let foundSource = find(state.sources, { id: source.id })
      if(!foundSource) {
        throw new Error(`No component source found: ${source}`)
      }

      state.activeSource = foundSource
    },

    unsetSource(state, { component }) {
      state.activeSource = null
    }
  },

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

    setSelectedGame(context, { gameId }) {
      context.commit("setSelectedGame", { gameId })
    }
  }
})

let idToken = persistence.loadIdToken()

if(idToken) {
  store.dispatch("loadStateFromDB", { idToken })
} else {
  //
}

export default store
