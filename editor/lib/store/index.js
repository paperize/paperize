import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
      // hydrate the user from the session
      let localDB = JSON.parse(localStorage.getItem("persistence"))
      profile = localDB[idToken].profile
      // profile = {
      //   name: 'Authed User',
      //   avatarSrc: 'http://placehold.it/20/20'
      // }

      // - hydrate the games collection from the user token
      // games = JSON.load(localStorage.getItem())
    }

    return { authenticated, profile, games }
  }
}

let initialStore = {
  state: persistence.loadState(),

  mutations: {
    logout (state) {
      // mutate state
      state.authenticated = false
      state.profile.name = ''
      state.profile.avatarSrc = ''
    }
  },

  actions: {

  }
}

export default new Vuex.Store(initialStore)
