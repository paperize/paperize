import Vue from 'vue'
import { find } from 'lodash'
import uuid from 'uuid/v4'

const SourcesModule = {
  state: {
    sources: []
  },

  getters: {
    sources: state => state.sources,
    findSource: state => source => {
      if(!source || !source.id ) { return null }
      let foundSource = find(state.sources, { id: source.id })
      if(!foundSource) {
        throw new Error(`No component source found: ${source}`)
      }

      return foundSource
    },

    sourceProperties: (state, getters) => source => {
      source = getters.findSource(source)
      let theProperties = (((source || { }).data || { }).values || [])[0]

      return theProperties
    },

    sourcePropertyExamples: () => (source, propertyName) => {
      let propertyIndex = sourceProperties(source).indexOf(propertyName) // getters.activeSourceProperties.indexOf(propertyName)

      return chain(source.data.values)
        .map((row) => row[propertyIndex])
        .compact()
        .slice(1, 4)
        .map((content) => truncate(content, { length: 24, separator: /,? +/ }))
        .join(', ')
      .value()
    },

    activeSource: (state, getters) => (getters.activeComponent || { }).source,

    activeSourceProperties: (state, getters) => {
      return getters.activeSource &&
        getters.sourceProperties(getters.activeSource)
    },

    activeSourcePropertyExamples: (state, getters) => (propertyName) => {
      return getters.activeSource &&
        getters.sourcePropertyExamples(getters.activeSource, propertyName) ||
        []
    }
  },

  mutations: {
    setSources (state, { sources }) {
      state.sources = sources
    },

    createSource(state, { source }) {
      source.id = source.id || uuid()
      state.sources.push(source)
    },

    deleteSource(state, { source }) {
      state.sources.splice(state.sources.indexOf(source), 1)
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
