import Vue from 'vue'
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
    fetchSheets({ commit }) {
      commit("setShowSpinner", true)
      return googleSheets
        .fetchSheets()
        .finally(() => commit("setShowSpinner", true))
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
