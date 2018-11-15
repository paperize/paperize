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
    userAvatar: state => state.avatarSrc || "/images/blank-avatar.png"
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
        .then(({ name, email, imageUrl }) => {
          // Find or create a database for this user
          return dispatch("googleFindOrCreateDatabase")
            .then((databaseFileId) => {
              console.log("dbfile:", databaseFileId)
              // set up the watcher with this file
              // dispatch("googleStartDatabaseWatcher", databaseFileId)
            })

            .then(() => {
              return dispatch("become", {
                idToken:   email,
                name:      name,
                avatarSrc: imageUrl
              })
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
