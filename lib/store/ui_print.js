const UIPrintModule = {
  state: {
    printJobStatus: "",
    statusWindowOpen: false
  },

  getters: {
    printJobStatus: state => state.printJobStatus,
    statusWindowOpen: state => state.statusWindowOpen
  },

  mutations: {
    setPrintJobStatus(state, newStatus) {
      state.printJobStatus = newStatus
    },

    setStatusWindowOpen(state, open) {
      state.statusWindowOpen = open
    },
  },

  actions: {
    startNewPrintJob({ commit }) {
      commit("setPrintJobStatus", "")
      commit("setStatusWindowOpen", true)
    },

    printJobStatusUpdate({ commit, getters }, statusText) {
      const newStatus = `${getters.printJobStatus}\n${statusText}`
      commit("setPrintJobStatus", newStatus)
    },

    printJobStatusInlineUpdate({ commit, getters }, statusText) {
      const
        currentStatus = getters.printJobStatus,
        inlineEnding = ', ',
        separator = currentStatus.endsWith(inlineEnding) ? '' : '\n',
        newStatus = `${getters.printJobStatus}${separator}${statusText}${inlineEnding}`

      commit("setPrintJobStatus", newStatus)
    },

    finishPrintJob({ commit, getters }) {
      // if(getters.statusWindowOpen) {
      //   commit("setStatusWindowOpen", false)
      // }
    },
  },
}

export default UIPrintModule
