import auth from '../auth'

const UsersModule = {
  state: {
    idToken: null,
    authenticated: false,
    name: '',
    avatarSrc: ''
  },

  getters: { },

  mutations: {
    logout(state) {
      state.authenticated = false
      state.idToken = null
      state.name = ''
      state.avatarSrc = ''
    },

    become(state, user) {
      state.authenticated = true
      state.idToken       = user.idToken
      state.name          = user.name
      state.avatarSrc     = user.avatarSrc
    },
  },

  actions: {
    become({ commit }, user) {
      commit("become", user)
    },

    login({ commit, dispatch }) {
      auth.getAuth2((auth2) => {
        auth2.signIn().then(
          (googleUser) => {
            commit("become", {
              idToken:   googleUser.getBasicProfile().getEmail(),
              name:      googleUser.getBasicProfile().getName(),
              email:     googleUser.getBasicProfile().getEmail(),
              avatarSrc: googleUser.getBasicProfile().getImageUrl()
            })
          },

          (error) => {
            console.error("Sign in Error:", error)
          })
      })
    },

    logout({ commit, dispatch }) {
      commit("logout")
      commit("resetStore")
      auth.getAuth2(auth2 => auth2.signOut())
    }
  }
}

export default UsersModule
