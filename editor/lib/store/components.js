import { find } from 'lodash'
import uuid from 'uuid/v4'

const ComponentsModule = {
  state: { },

  getters: {
    findGameComponent: (state) => (game, { id }) => {
      let foundComponent = find(game.components, { id })
      if(!foundComponent) {
        throw new Error(`No component found with id: ${id}`)
      }

      return foundComponent
    }
  },

  mutations: {
    createGameComponent(state, { game, component }) {
      component.id = component.id || uuid()
      game.components.push(component)
    },

    updateComponent(state, { componentToUpdate, componentToCopy }) {
      Object.assign(componentToUpdate, componentToCopy)
    },

    deleteGameComponent(state, { game, component }) {
      game.components.splice(game.components.indexOf(component), 1)
    }
  },

  actions: {
    createComponent({ state, commit, rootGetters }, { component }) {
      let game = rootGetters.activeGame
      commit("createGameComponent", { game, component })
    },

    updateComponent({commit, rootGetters, getters}, { component }) {
      let game = rootGetters.activeGame
      let componentToUpdate = getters.findGameComponent(game, component)
      commit("updateComponent", { componentToUpdate, componentToCopy: component })
    },

    deleteComponent({ rootState, commit, rootGetters }, { component }) {
      let game = rootGetters.activeGame
      commit("deleteGameComponent", { game, component })

      if(rootState.activeComponent.id == component.id){
        commit("clearActiveComponent")
      }
    },

    setComponentSource({ state, commit, getters, rootGetters }, { component, source }) {
      component = getters.findGameComponent(rootGetters.activeGame, component)
      source = rootGetters.findSource(source)

      commit("setComponentSource", { component, source })
    },

  }
}

export default ComponentsModule
