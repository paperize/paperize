import Vue  from 'vue'
import Vuex from 'vuex'

import user       from './user'
import games      from './games'
import components from './components'
import sources    from './sources'
import transforms from './transforms'
import google     from './google'

Vue.use(Vuex)

const INITIAL_STATE = {
  user:       user.state,
  games:      games.state,
  components: components.state,
  sources:    sources.state,
  transforms: transforms.state,
  google:     google.state,
  imageLibraryOpen: false
}

// Feeling hacky here, but having trouble with Observers contaminating my statics
const newInitialState = () => {
  return JSON.parse(JSON.stringify(INITIAL_STATE))
}

let store = new Vuex.Store({
  // Throw errors if state is touched outside of mutations
  strict: process.env.NODE_ENV !== 'production',
  // All state established inside modules
  state: newInitialState(),
  modules: { user, games, components, sources, transforms, google },
  mutations: {
    resetState(state, newState={}) {
      Object.assign(state, { ...newInitialState(), ...newState })
    },

    openImageLibrary(state) {
      state.imageLibraryOpen = true
    }
  },
  actions: {
    openImageLibrary({ commit }) {
      commit("openImageLibrary")
    }
  }
})

export default store
