import { find } from 'lodash'

const UIModule = {
  state: {
    activeGameId:       null,
    activeComponentId:  null,
    activeLayerId:      null
  },

  getters: {
    activeGame(state, getters, rootState, rootGetters) {
      if(state.activeGameId) {
        return rootGetters.findGame(state.activeGameId)
      }
    },

    activeComponent(state, getters, rootState, rootGetters) {
      if(state.activeComponentId) {
        return rootGetters.findComponent(state.activeComponentId)
      }
    },

    activeSource: (state, getters, rootState, rootGetters) => {
      if(getters.activeComponent) {
        return rootGetters.findComponentSource(getters.activeComponent)
      }
    },


    activeLayer(state, getters, rootState, rootGetters) {
      if(state.activeLayerId) {
        return rootGetters.findLayer(state.activeLayerId)
      }
    },

    activeDimensions(state, getters, rootState, rootGetters) {
      if(getters.activeLayer) {
        return rootGetters.findDimension(getters.activeLayer.dimensionId)
      }
    }
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

    setActiveComponent({ commit, getters, rootGetters }, componentId) {
      let component = rootGetters.findComponent(componentId)

      commit("setActiveComponent", { component })
    }
  },

  // respond to other commits
  subscribe({ commit }, { type, payload }) {
    if(type === 'destroyComponent') {
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
