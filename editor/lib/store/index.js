import Vue from 'vue'
import Vuex from 'vuex'

import auth from '../auth'

Vue.use(Vuex)

// LocalStore persistence layer
let persistence = {
  loadState: function() {
    // fetch the JWT from storage
    let idToken = localStorage.getItem("id_token")
    // let idToken = 'i am a JWT'
    let authenticated = !!idToken
    let profile = {
      name: '',
      avatarSrc: ''
    }
    let games = []

    // do we have an active session?
    if(authenticated) {
      profile = this.loadProfile(idToken) || profile
    }

    return { idToken, authenticated, profile, games }
  },

  loadProfile: function(idToken) {
    // hydrate the user from the session
    let localDB = JSON.parse(localStorage.getItem("persistence")) || {}
    let profile = localDB[idToken] && localDB[idToken].profile

    return profile
  },

  saveState: function(state) {
    localStorage.setItem("id_token", state.idToken)
  }
  // - hydrate the games collection from the user token
  // games = JSON.load(localStorage.getItem())
}

// Auth0 Authentication Layer
auth.on("authenticated", ({ idToken }) => {
  store.dispatch("loggedInAs", { idToken })
})

let store = new Vuex.Store({
  state: persistence.loadState(),

  mutations: {
    logout (state) {
      // mutate state
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
      state.profile.avatarSrc = payload.profile.picture

      persistence.saveState(state)
    }
  },

  actions: {
    login () {
      auth.promptForLogin()
    },

    loggedInAs (context, { idToken }) {
      let profile = persistence.loadProfile(idToken)

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
            commitProfile()
          }
        })
      } else {
        commitProfile()
      }
    }
  }
})

export default store
