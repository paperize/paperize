const UIModule = {
  state: {
    activeGameId:       null,
    activeComponentId:  null,
    activeLayerId:      null,
    layerHighlighting:  false,
    activeItem:         null,
    darkMode:           false,
  },

  getters: {
    activeGame(state, _, __, rootGetters) {
      return rootGetters.findGame(state.activeGameId, false)
    },

    activeComponent(state, _, __, rootGetters) {
      return rootGetters.findComponent(state.activeComponentId, false)
    },

    activeSheetProperties(_, getters, __, rootGetters) {
      const ac = getters.activeComponent
      if(ac && ac.spreadsheetId && ac.worksheetId) {
        return rootGetters.worksheetPropertyNames(ac.spreadsheetId, ac.worksheetId)
      } else {
        return []
      }
    },

    activeTemplate(state, getters, __, rootGetters) {
      const component = getters.activeComponent
      return rootGetters.findComponentTemplate(component)
    },

    activeLayer(state, _, __, rootGetters) {
      return rootGetters.findLayer(state.activeLayerId, false)
    },

    activeDimensions(_, getters, __, rootGetters) {
      if(getters.activeLayer) {
        return rootGetters.findDimension(getters.activeLayer.dimensionId, false)
      }
    },

    activeItem: (state) => state.activeItem,

    layerHighlighting: (state) => state.layerHighlighting,

    darkMode: (state) => state.darkMode
  },

  mutations: {
    setActiveGame(state, { game }) {
      state.activeGameId = game.id
    },

    clearActiveGame(state) {
      state.activeGameId = null
    },

    setActiveComponent(state, { component }) {
      state.activeComponentId = component.id
      state.activeLayerId = null
      state.activeDimensionsId = null
    },

    clearActiveComponent(state) {
      state.activeComponentId = null
      state.activeLayerId = null
      state.activeDimensionsId = null
    },

    setActiveLayer(state, { layerId, dimensionId }) {
      state.activeLayerId = layerId
      state.activeDimensionsId = dimensionId
    },

    setActiveItem(state, item) {
      state.activeItem = item
    },

    clearActiveLayer(state) {
      state.activeLayerId = null
      state.activeDimensionsId = null
    },

    setLayerHighlighting(state, layerHighlighting) {
      state.layerHighlighting = layerHighlighting
    },

    setDarkMode(state, darkMode) {
      state.darkMode = darkMode
    }
  },

  actions: {
    setActiveGame({ commit, rootGetters }, gameId) {
      let game = rootGetters.findGame(gameId)
      commit("setActiveGame", { game })
    },

    setActiveLayer({ commit }, layer) {
      commit("setActiveLayer", {
        layerId: layer.id,
        dimensionId: layer.dimensionId
      })
    },

    clearActiveLayer({ commit }) {
      commit("clearActiveLayer")
    },

    clearActiveGame({ commit }) {
      commit("clearActiveComponent")
      commit("clearActiveGame")
    },

    setActiveComponent({ dispatch, commit, rootGetters }, componentId) {
      let component = rootGetters.findComponent(componentId)

      commit("setActiveComponent", { component })

      if(component.spreadsheetId) {
        return dispatch("ensureSheetIndexed", component.spreadsheetId)
          .catch({ code: 'NOT_FOUND' }, () => {
            return dispatch("unlinkComponentSheet", component)
          })
      }
    },

    setActiveItem({ commit }, item) {
      commit("setActiveItem", item)
    },

    setDarkMode({ commit }, darkMode) {
      commit("setDarkMode", darkMode)
    }
  },


  // respond to other commits
  subscribe({ dispatch, commit }, { type, payload }) {
    if(type === 'createGame') {
      dispatch("setActiveGame", payload.id)
    } else if(type === 'destroyGame') {
      dispatch("clearActiveGame")
    } else if(type === 'destroyComponent') {
      commit("clearActiveComponent")
    } else if(type === 'createComponent') {
      commit("setActiveComponent", { component: payload })
    } else if(type === 'destroyLayer') {
      commit("clearActiveLayer")
    } else if(type === 'createLayer') {
      dispatch("setActiveLayer", payload)
    }
  }
}


export default UIModule
