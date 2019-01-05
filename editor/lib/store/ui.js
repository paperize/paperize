const UIModule = {
  state: {
    activeGameId:       null,
    activeComponentId:  null,
    activeLayerId:      null,
    layerHighlighting:  false
  },

  getters: {
    activeGame(state, _, __, rootGetters) {
      return rootGetters.findGame(state.activeGameId, false)
    },

    activeComponent(state, _, __, rootGetters) {
      return rootGetters.findComponent(state.activeComponentId, false)
    },

    activeSource(_, getters, __, rootGetters) {
      if(getters.activeComponent) {
        return rootGetters.findComponentSource(getters.activeComponent, false)
      }
    },

    activeLayer(state, _, __, rootGetters) {
      return rootGetters.findLayer(state.activeLayerId, false)
    },

    activeDimensions(_, getters, __, rootGetters) {
      if(getters.activeLayer) {
        return rootGetters.findDimension(getters.activeLayer.dimensionId, false)
      }
    },

    layerHighlighting: (state) => state.layerHighlighting
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

    setActiveLayer(state, { layer }) {
      state.activeLayerId = layer.id
      state.activeDimensionsId = layer.dimensionId
    },

    clearActiveLayer(state) {
      state.activeLayerId = null
      state.activeDimensionsId = null
    },

    setLayerHighlighting(state, layerHighlighting) {
      state.layerHighlighting = layerHighlighting
    }
  },

  actions: {
    setActiveGame({ commit, rootGetters }, gameId) {
      let game = rootGetters.findGame(gameId)
      commit("setActiveGame", { game })
    },

    clearActiveGame({ commit }) {
      commit("clearActiveComponent")
      commit("clearActiveGame")
    },

    setActiveComponent({ commit, rootGetters }, componentId) {
      let component = rootGetters.findComponent(componentId)

      commit("setActiveComponent", { component })
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
      commit("setActiveLayer", { layer: payload })
    }
  }
}


export default UIModule
