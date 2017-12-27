import { find } from 'lodash'
import uuid from 'uuid/v4'

const ComponentsModule = {
  state: { },

  getters: {
    findGameComponent: state => (game, componentId, throwOnFail=true) => {
      let foundComponent = find(game.components, { id: componentId })
      if(!foundComponent && throwOnFail) {
        throw new Error(`No component found with id: ${componentId}`)
      }

      return foundComponent
    },

    getComponentItems: (state, getters) => component => {
      if(!component.source) {
        return []
      } else {
        return getters.getSourceItems(component.source)
      }
    }
  },

  mutations: {
    createGameComponent(state, { game, component }) {
      game.components.push(component)
    },

    updateComponent(state, { componentToUpdate, componentToCopy }) {
      Object.assign(componentToUpdate, componentToCopy)
    },

    deleteGameComponent(state, { game, component }) {
      game.components.splice(game.components.indexOf(component), 1)
    },
  },

  actions: {
    createComponent({ commit, getters, rootGetters }, { component }) {
      let game = rootGetters.activeGame
      if(!component.id || getters.findGameComponent(game, component.id, false)) {
        component.id = uuid()
      }
      commit("createGameComponent", { game, component })
    },

    updateComponent({commit, rootGetters, getters}, { component }) {
      let game = rootGetters.activeGame
      let componentToUpdate = getters.findGameComponent(game, component.id)
      commit("updateComponent", { componentToUpdate, componentToCopy: component })
    },

    deleteComponent({ commit, rootGetters }, { component }) {
      if(rootGetters.activeComponent.id == component.id) {
        commit("clearActiveComponent")
      }

      let game = rootGetters.activeGame
      commit("deleteGameComponent", { game, component })
    },

    setComponentSource({ state, commit, getters, rootGetters }, { component, source }) {
      component = getters.findGameComponent(rootGetters.activeGame, component.id)
      source = rootGetters.findSource(source)

      commit("setComponentSource", { component, source })
    },
  }
}

export default ComponentsModule
