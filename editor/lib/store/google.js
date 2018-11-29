import { auth, sheets, drive } from '../services/google'

const GoogleModule = {
  state: {
    showSpinner: false,
    loginStatus: ""
  },

  getters: {
    showSpinner: state => state.showSpinner,
    loginStatus: state => state.loginStatus
  },

  mutations: {
    setShowSpinner(state, showOrNot) {
      state.showSpinner = showOrNot
    },

    setLoginStatus(state, newStatusMessage) {
      state.loginStatus = `${newStatusMessage}\n`
    },

    appendLoginStatus(state, nextStatusMessage) {
      state.loginStatus += `${nextStatusMessage}\n`
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

    // Returns the ID of a database file in Drive, possibly creating the file
    // and folder along the way.
    googleFindOrCreateDatabase() { }
  }
}

export default GoogleModule
