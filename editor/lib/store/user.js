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
          // We're logged into Google, set up the local user
          return dispatch("become", {
            idToken:   email,
            name:      name,
            avatarSrc: imageUrl
          })
        })

        .then(() => {
          // Find or create a database for this user
          return dispatch("googleDatabaseLookup")
            .then((foundDatabase) => {
              if(foundDatabase) {
                // Found a remote database, load it
                // return commit("resetState", foundDatabase)
                throw new Error("NOT IMPLEMENTED: load database")
              } else {
                // No remote database, create one
                return dispatch("googleDatabaseInitialize")
              }
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
