import blankAvatar from "/images/blank-avatar.png"

const UsersModule = {
  state: {
    idToken: null,
    authenticated: false,
    name: '',
    avatarSrc: null,
    loginError: null
  },

  getters: {
    loggedIn: state => state.authenticated,
    loginError: state => state.loginError,
    userId: state => state.idToken,
    userName: state => state.name,
    userAvatar: state => state.avatarSrc || blankAvatar
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
      // call the Google auth pop-up
      return dispatch("googleLogin")
        .catch((error) => {
          commit("setLoginError", error.message)
          return null
        })
    },

    logout({ dispatch }) {
      return dispatch("googleLogout")
    },

    revokeAccessAndLogout({ dispatch }) {
      return dispatch("googleRevokeAccess").then(() => {
        return dispatch("googleLogout")
      })
    }
  }
}

export default UsersModule
