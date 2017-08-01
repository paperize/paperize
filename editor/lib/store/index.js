import Vue from 'vue'
import Vuex from 'vuex'

import persistence from './local_store_persistence'
import auth from '../auth'
import router from '../routes'

Vue.use(Vuex)

const EMPTY_STATE = {
  idToken: null,
  authenticated: false,
  profile: {
    name: '',
    avatarSrc: ''
  },
  games: []
}

let store = new Vuex.Store({
  state: EMPTY_STATE,

  mutations: {
    logout (state) {
      state.idToken = null
      state.authenticated = false
      state.profile.name = ''
      state.profile.avatarSrc = ''

      persistence.saveState(state)
      router.push({ name: 'splash' })
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
    },

    createGame (state, { game }) {
      state.games.push(game)
    },

    deleteGame (state, { game }) {
      state.games.splice(state.games.indexOf(game), 1)
    }
  },

  actions: {
    login () {
      auth.promptForLogin()
    },

    loggedInAs (context, { idToken }) {
      let games = persistence.loadGames(idToken)
      let profile = persistence.loadProfile(idToken)

      context.commit("setGames", { games })

      let commitProfile = function() {
        context.commit("authenticateAs", { idToken, profile })
        router.push({ name: 'gameManager' })
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
    }
  }
})

let idToken = persistence.loadToken()

if(idToken) {
  // Log in with a persisted token
  store.dispatch("loggedInAs", { idToken })

} else {
  // Log in with Auth0
  auth.on("authenticated", ({ idToken }) => {
    store.dispatch("loggedInAs", { idToken })
  })
}

export default store
