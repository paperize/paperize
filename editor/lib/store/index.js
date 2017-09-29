import Vue  from 'vue'
import Vuex from 'vuex'

import user       from './user'
import games      from './games'
import components from './components'
import sources    from './sources'
import google     from './google'

Vue.use(Vuex)

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',
  // All state established inside modules
  state: { },
  modules: { user, games, components, sources, google },
  mutations: {
    initializeStore(state, { user, games, sources }) {
      state.user = user
      state.games.games = games
      state.sources.source = sources
    },

    resetStore(state) {
      state.user = {
        authenticated: false,
        idToken: null,
        name: '',
        avatarSrc: ''
      }
      state.games.games = []
      state.sources.source = []
    }
  }
})

export default store
