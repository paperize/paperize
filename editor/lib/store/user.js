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

    authenticateAs(state, { idToken }) {
      state.authenticated = true
      state.idToken = idToken
    },

    setProfile(state, { profile }) {
      state.name = profile.name
      state.avatarSrc = profile.avatarSrc
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
    }
  }
}

export default UsersModule
