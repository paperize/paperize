import { find } from 'lodash'

const UIModule = {
  state: {
    activeGameId: null,
    activeComponentId: null,
    activeLayerId: null
  },

  getters: {
    activeGame(state, getters, rootState, rootGetters) {
      if(state.activeGameId) {
        return rootGetters.findGame(state.activeGameId)
      }
    },

    activeComponent(state, getters, rootState, rootGetters) {
      if(state.activeComponentId) {
        return rootGetters.findGameComponent(getters.activeGame, state.activeComponentId)
      }
    },

    activeLayer(state, getters, rootState, rootGetters) {
      if(state.activeLayerId) {
        return rootGetters.findTemplateLayer(getters.activeComponent.template, state.activeLayerId)
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
    },

    clearActiveComponent(state) {
      state.activeComponentId = null
    },

    setActiveLayer(state, { layer }) {
      state.activeLayerId = layer.id
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
      let component = rootGetters.findGameComponent(getters.activeGame, componentId)

      commit("setActiveComponent", { component })
    }
  }
}

export default UIModule
