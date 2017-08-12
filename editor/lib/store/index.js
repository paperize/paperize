import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'

import { find } from 'lodash'

import persistence from './local_store_persistence'
import lock from '../auth'

Vue.use(Vuex)

const EMPTY_STATE = {
  idToken: null,
  accessToken: null,
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

    authenticateAs (state, { idToken, accessToken, profile }) {
      state.idToken = idToken
      state.accessToken = accessToken
      state.authenticated = true
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
    }
  },

  actions: {
    login () {
      lock.promptForLogin()
    },

    loggedInAs (context, { accessToken, idToken, idTokenPayload }) {
      let userId = idTokenPayload.sub

      console.log("Accepting JWT:", idToken)
      console.log("JWT Payload:", idTokenPayload)
      console.log("User ID:", userId)

      let games = persistence.loadGames(idToken) || []
      context.commit("setGames", { games })

      lock.getUserInfo(accessToken, (error, userInfo) => {
        if(error) {
          console.error("Error fetching profile for:", userId)
          console.error(error.message)
        } else {
          console.log("User Info:", userInfo)
          let googleToken = userInfo.access_token
          let profile = {
            avatarSrc: userInfo.picture,
            name:      userInfo.name
          }
          context.commit("authenticateAs", { idToken, accessToken, profile })
          context.commit("setGoogleToken", { token: googleToken })
        }
      })
    },

    setSelectedGame(context, { gameId }) {
      context.commit("setSelectedGame", { gameId })
    }
  }
})

import decode from 'jwt-decode'
let { idToken, accessToken } = persistence.loadTokens()

if(idToken && accessToken) {
  store.dispatch("loggedInAs", { idToken, accessToken, idTokenPayload: decode(idToken) })
} else {
  // Log in with Auth0
  lock.on("authenticated", (authResult) => {
    console.log("Auth Response:", authResult)
    store.dispatch("loggedInAs", authResult)
  })
}

export default store
