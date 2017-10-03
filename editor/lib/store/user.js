const UsersModule = {
  state: {
    idToken: null,
    authenticated: false,
    name: '',
    avatarSrc: ''
  },

  getters: { },

  mutations: {
    become(state, user) {
      state.authenticated = true
      state.idToken       = user.idToken
      state.name          = user.name
      state.avatarSrc     = user.avatarSrc
    },

    logout() { }
  },

  actions: {
    become({ commit }, user) {
      commit("resetState")
      commit("become", user)
    },

    login({ dispatch }) {
      return dispatch("googleLoginFlow")
        .then((googleUser) => {
          return dispatch("become", {
            idToken:   googleUser.getBasicProfile().getEmail(),
            name:      googleUser.getBasicProfile().getName(),
            email:     googleUser.getBasicProfile().getEmail(),
            avatarSrc: googleUser.getBasicProfile().getImageUrl()
          })
        })

        .catch((error) => {
          console.error("Sign in Error:", error)
        })
    },

    logout({ commit, dispatch }) {
      commit("resetState")
      commit("logout")
      dispatch("googleLogout")
    }
  }
}

export default UsersModule
