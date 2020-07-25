import { includes, max, min, pick, omit } from 'lodash'
import massAssign from './util/mass_assign'

export const
  DEFAULT_MARGIN = .25,
  PRINT_ALL_COMPONENTS = "all_components",
  PRINT_SELECT_COMPONENTS = "select_components",
  MODE_AUTO_LAYOUT = "auto_layout",
  MODE_COMPONENT_PER_PAGE = "component_per_page",
  PAGE_DIMENSIONS = {
    a4: {
      name: 'A4',
      width: 8.3,
      height: 11.7
    },
    letter: {
      name: 'Letter',
      width: 8.5,
      height: 11
    },
    universal: {
      name: 'Universal',
      width: 8.3,
      height: 11
    },
  },
  ORIENTATION_PORTRAIT = 'portrait',
  ORIENTATION_LANDSCAPE = 'landscape',
  ORIENTATIONS = [ ORIENTATION_PORTRAIT, ORIENTATION_LANDSCAPE ],
  TARGET_PDF = 'pdf',
  TARGET_PNG = 'png',
  TARGETS = [ TARGET_PDF, TARGET_PNG ],
  DEFAULT_TARGET = TARGET_PDF

const PrintModule = {
  state: {
    mode: MODE_AUTO_LAYOUT,
    paper: 'universal',
    orientation: ORIENTATION_PORTRAIT,
    customWidth: 8.3,
    customHeight: 11,
    componentSpacing: false,
    componentMerging: false,
    marginTop: DEFAULT_MARGIN,
    marginRight: DEFAULT_MARGIN,
    marginBottom: DEFAULT_MARGIN,
    marginLeft: DEFAULT_MARGIN,
    target: DEFAULT_TARGET,
  },

  getters: {
    getPrintSettings: (state, getters) => {
      let staticOptions = omit(state, ["customWidth", "customHeight"]),
        allOptions = { ...staticOptions, ...getters.pageDimensions }

      return allOptions
    },

    printTarget: state => state.target,

    pageDimensions: (state) => {
      if(state.paper === 'custom') {
        return {
          width: state.customWidth,
          height: state.customHeight
        }

      } else {
        let dimensions = pick(PAGE_DIMENSIONS[state.paper], ["width", "height"])

        if(state.orientation === ORIENTATION_LANDSCAPE) {
          return {
            width: max([dimensions.width, dimensions.height]),
            height: min([dimensions.width, dimensions.height])
          }

        } else {
          return {
            width: min([dimensions.width, dimensions.height]),
            height: max([dimensions.width, dimensions.height])
          }
        }
      }
    },
  },

  mutations: {
    updatePrintSettings(state, attributes) {
      massAssign(state, attributes)
    },

    setPrintTarget(state, target) {
      state.target = target
    }
  },

  actions: {
    updatePrintSettings({ commit }, attributes) {
      commit("updatePrintSettings", attributes)
    },

    setPrintTarget({ commit }, target) {
      if(includes(TARGETS, target)) {
        commit("setPrintTarget", target)
      } else {
        throw new Error(`Tried to set invalid print target: ${target}`)
      }
    }
  }
}

export default PrintModule
