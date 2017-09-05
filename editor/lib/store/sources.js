import Vue from 'vue'
import { find } from 'lodash'
import uuid from 'uuid/v4'

const SourcesModule = {
  state: {
    sources: []
  },

  getters: {
    sources: state => state.sources,
    findSource: (state) => (source) => {
      if(!source || !source.id ) { return null }
      let foundSource = find(state.sources, { id: source.id })
      if(!foundSource) {
        throw new Error(`No component source found: ${source}`)
      }

      return foundSource
    },

    sourceProperties: (state, getters) => (source) => {
      source = getters.findSource(source)
      let theProperties = (((source || { }).data || { }).values || [])[0]

      return theProperties
    },
  },

  mutations: {
    setSources (state, { sources }) {
      state.sources = sources
    },

    createSource(state, { source }) {
      source.id = source.id || uuid()
      state.sources.push(source)
    },

    setComponentSource(state, { component, source }) {
      Vue.set(component, "source", source)
    },

    unsetComponentSource(state, { component }) {
      component.source = null
    }
  },

  actions: {
    addAndSelectSource({ commit, dispatch }, { source }) {
      commit("createSource", { source })
      dispatch("setActiveComponentSource", { source })
    },

    setActiveComponentSource({ commit, getters }, { source }) {
      commit("setComponentSource", { component: getters.activeComponent, source })
    },
  }
}

export default SourcesModule
