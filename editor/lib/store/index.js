import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'

import { find } from 'lodash'

import persistence from './local_store_persistence'
import auth from '../auth'

Vue.use(Vuex)

const EMPTY_STATE = {
  idToken: null,
  authenticated: false,
  profile: {
    name: '',
    avatarSrc: ''
  },
  games: [],
  selectedGame: null,
  activeComponent: null
}

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',

  state: EMPTY_STATE,

  mutations: {
    logout (state) {
      state.idToken = null
      state.authenticated = false
      state.profile.name = ''
      state.profile.avatarSrc = ''

      persistence.saveState(state)
    },

    authenticateAs (state, payload) {
      state.idToken = payload.idToken
      state.authenticated = true
      state.profile.name = payload.profile.name
      state.profile.avatarSrc = payload.profile.avatarSrc

      persistence.saveState(state)
    },

    setGames (state, { games }) {
      state.games = games

      persistence.saveState(state)
    },

    createGame (state, { game }) {
      game.id = uuid()
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
      component.id = uuid()
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

    setActiveComponent(state, { component }) {
      let foundComponent = find(state.selectedGame.components, { id: component.id })
      if(!foundComponent) {
        throw new Error(`No component found: ${component}`)
      }

      state.activeComponent = foundComponent
    }
  },

  actions: {
    login () {
      auth.promptForLogin()
    },

    loggedInAs (context, { idToken }) {
      let games = persistence.loadGames(idToken) || []
      let profile = persistence.loadProfile(idToken)

      context.commit("setGames", { games })

      let commitProfile = function() {
        context.commit("authenticateAs", { idToken, profile })
      }

      if(!profile) {
        auth.getProfile(idToken, (error, fetchedProfile) => {
          if(error) {
            console.error("Error fetching profile for:", idToken)
            console.error(error.message)
          } else {
            profile = fetchedProfile
            profile.avatarSrc = profile.picture
            commitProfile()
          }
        })
      } else {
        commitProfile()
      }
    },

    setSelectedGame(context, { gameId }) {
      context.commit("setSelectedGame", { gameId })
    }
  }
})

let idToken = persistence.loadToken()

if(idToken) {
  store.dispatch("loggedInAs", { idToken })
} else {
  // Log in with Auth0
  auth.on("authenticated", ({ idToken }) => {
    store.dispatch("loggedInAs", { idToken })
  })
}

export default store
