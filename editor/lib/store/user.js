const UsersModule = {
  state: {
    idToken: null,
    authenticated: false,
    name: '',
    avatarSrc: '',
    loginError: null
  },

  getters: {
    loginError: state => state.loginError
  },

  mutations: {
    become(state, user) {
      state.authenticated = true
      state.idToken       = user.idToken
      state.name          = user.name
      state.avatarSrc     = user.avatarSrc
    },

    setLoginError(state, errorType) {
      state.loginError = errorType
    },

    logout() { }
  },

  actions: {
    become({ commit }, user) {
      commit("resetState")
      commit("become", user)
    },

    login({ dispatch, commit }) {
      commit("setLoginError", null)
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
          commit("setLoginError", error.message)
          return null
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
