import Promise from 'bluebird'
import Vue from 'vue'
import auth from '../auth'
import googleSheets from '../google_sheets'

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
    googleLoginFlow({ commit }) {
      return new Promise((resolve, reject) => {
        auth.getAuth2((auth2) => {
          auth2.signIn().then(
            (googleUser) => { resolve(googleUser) },
            (error) => { reject(new Error(error.error)) }
          )
        })
      })
    },

    googleLogout() {
      auth.getAuth2(auth2 => auth2.signOut())
    },

    fetchSheets({ commit }) {
      commit("setShowSpinner", true)
      return googleSheets
        .fetchSheets()
        .finally(() => commit("setShowSpinner", false))
    },

    fetchSheetById({ commit }, sourceId) {
      commit("setShowSpinner", true)
      return googleSheets
        .fetchSheetById(sourceId)
        .finally(() => commit("setShowSpinner", false))
    }
  }
}

export default GoogleModule
