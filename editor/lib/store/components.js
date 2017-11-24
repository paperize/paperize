import { find } from 'lodash'
import uuid from 'uuid/v4'

const ComponentsModule = {
  state: {
    activeComponent: null
  },

  getters: {
    activeComponent: state => state.activeComponent,

    findGameComponent: state => (game, { id }, throwOnFail=true) => {
      let foundComponent = find(game.components, { id })
      if(!foundComponent && throwOnFail) {
        throw new Error(`No component found with id: ${id}`)
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

    updateComponentPageSize(state, { component, pageSize }) {
      component.pageSize = pageSize
    },

    deleteGameComponent(state, { game, component }) {
      game.components.splice(game.components.indexOf(component), 1)
    },

    setActiveComponent(state, { component }) {
      state.activeComponent = component
    },

    clearActiveComponent(state) {
      state.activeComponent = null
    }
  },

  actions: {
    createComponent({ commit, getters, rootGetters }, { component }) {
      let game = rootGetters.activeGame
      if(!component.id || getters.findGameComponent(game, component, false)) {
        component.id = uuid()
      }
      commit("createGameComponent", { game, component })
      commit("setActiveComponent", { component })
    },

    updateComponent({commit, rootGetters, getters}, { component }) {
      let game = rootGetters.activeGame
      let componentToUpdate = getters.findGameComponent(game, component)
      commit("updateComponent", { componentToUpdate, componentToCopy: component })
    },

    deleteComponent({ state, commit, rootGetters }, { component }) {
      let game = rootGetters.activeGame
      commit("deleteGameComponent", { game, component })

      if(state.activeComponent.id == component.id){
        commit("clearActiveComponent")
      }
    },

    setComponentSource({ state, commit, getters, rootGetters }, { component, source }) {
      component = getters.findGameComponent(rootGetters.activeGame, component)
      source = rootGetters.findSource(source)

      commit("setComponentSource", { component, source })
    },

    setActiveComponent({ commit, getters, rootGetters }, { component }) {
      component = getters.findGameComponent(rootGetters.activeGame, component)

      commit("setActiveComponent", { component })
    }
  }
}

export default ComponentsModule
