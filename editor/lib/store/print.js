import massAssign from './util/mass_assign'

export const DEFAULT_MARGIN = .25,
  MODE_AUTO_LAYOUT = "auto_layout",
  MODE_COMPONENT_PER_PAGE = "component_per_page"

const PrintModule = {
  state: {
    mode: MODE_AUTO_LAYOUT,
    width: 8.3,
    height: 11,
    componentSpacing: false,
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
