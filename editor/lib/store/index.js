import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let defaultStore = {
  user: {
    authenticated: false,
    name: '',
    avatarSrc: ''
  },
  games: []
}

export default new Vuex.Store(defaultStore)
