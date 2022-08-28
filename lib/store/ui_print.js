// TODO: start migrating from "print" to "export" terminology
const UIPrintModule = {
  state: {
    exportGameStatus: "",
    exportItemStatus: "",
    exportStartedAt: null,
    statusWindowOpen: false
  },

  getters: {
    exportStartedAt: state => state.exportStartedAt,
    exportGameStatus: state => state.exportGameStatus,
    exportItemStatus: state => state.exportItemStatus,
    statusWindowOpen: state => state.statusWindowOpen
  },

  mutations: {
    setExportStartedAt(state, newTime) {
      state.exportStartedAt = newTime
    },

    setExportGameStatus(state, newStatus) {
      state.exportGameStatus = newStatus
    },

    setExportItemStatus(state, newStatus) {
      state.exportItemStatus = newStatus
    },

    setStatusWindowOpen(state, open) {
      state.statusWindowOpen = open
    },
  },

  actions: {
    startExportItem({ commit }) {
      commit("setExportStartedAt", Date.now())
      commit("setExportItemStatus", "Exporting...")
    },

    exportItemStatusUpdate({ commit, getters }, statusText) {
      const newStatus = `${getters.exportItemStatus}\n${statusText}`
      commit("setExportItemStatus", newStatus)
    },

    finishExportItem({ commit, getters }) {
      const
        separator = getters.exportItemStatus.endsWith('...') ? ' ' : '\n',
        exportTime = (Date.now() - getters.exportStartedAt)/1000

      commit("setExportItemStatus", `${getters.exportItemStatus}${separator}Done. ${exportTime}s`)
    },

    clearExportGameStatus({ commit }) {
      commit("setExportGameStatus", "")
    },

    startGameExport({ commit }) {
      commit("setExportStartedAt", Date.now())
      commit("setExportGameStatus", "Exporting...")
      commit("setStatusWindowOpen", true)
    },

    exportGameStatusUpdate({ commit, getters }, statusText) {
      const newStatus = `${getters.exportGameStatus}\n${statusText}`
      commit("setExportGameStatus", newStatus)
    },

    exportGameStatusInlineUpdate({ commit, getters }, statusText) {
      const
        currentStatus = getters.exportGameStatus,
        inlineEnding = ', ',
        separator = currentStatus.endsWith(inlineEnding) ? '' : '\n',
        newStatus = `${currentStatus}${separator}${statusText}${inlineEnding}`

      commit("setExportGameStatus", newStatus)
    },

    finishGameExport({ commit, getters }) {
      const
        separator = getters.exportGameStatus.endsWith('...') ? ' ' : '\n',
        exportTime = (Date.now() - getters.exportStartedAt)/1000

      commit("setExportGameStatus", `${getters.exportGameStatus}${separator}Done. ${exportTime}s`)
    },
  },
}

export default UIPrintModule
