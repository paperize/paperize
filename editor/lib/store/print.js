import massAssign from './util/mass_assign'

const DEFAULT_MARGIN = .25

const PrintModule = {
  state: {
    width: 8.3,
    height: 11,
    marginTop: DEFAULT_MARGIN,
    marginRight: DEFAULT_MARGIN,
    marginBottom: DEFAULT_MARGIN,
    marginLeft: DEFAULT_MARGIN,
  },

  getters: {
    getPrintSettings: state => state
  },

  mutations: {
    updatePrintSettings(state, attributes) {
      massAssign(state, attributes)
    }
  },

  actions: {
    updatePrintSettings({ commit }, attributes) {
      commit("updatePrintSettings", attributes)
    }
  }
}

export default PrintModule
