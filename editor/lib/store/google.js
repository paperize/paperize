import { auth, sheets, drive } from '../services/google'

const GoogleModule = {
  state: {
    showSpinner: false
  },

  getters: {
    showSpinner: state => state.showSpinner
  },

  mutations: {
    setShowSpinner(state, showOrNot) {
      state.showSpinner = showOrNot
    }
  },

  actions: {
    googleLogin() {
      return auth.signIn()
    },

    googleLogout() {
      return auth.signOut()
    },

    googleFetchSheets({ commit }) {
      commit("setShowSpinner", true)
      return sheets
        .fetchSheets()
        .finally(() => commit("setShowSpinner", false))
    },

    googleFetchSheetById({ commit }, sourceId) {
      commit("setShowSpinner", true)
      return sheets
        .fetchSheetById(sourceId)
        .finally(() => commit("setShowSpinner", false))
    },

    googleDatabaseLookup() {
      // return a db ready to load or null
      return drive.databaseLookup()
    },

    googleDatabaseInitialize() {
      // get current vuex state
      // cull to relevant bits
      // upload to Drive
    }
  }
}

export default GoogleModule
