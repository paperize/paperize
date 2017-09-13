import Vue from 'vue'
import { find } from 'lodash'
import uuid from 'uuid/v4'

import googleSheets from '../google_sheets'

const SourcesModule = {
  state: {
    sources: [],
    remoteSources: []
  },

  getters: {
    sources: state => state.sources,

    remoteSources: state => state.remoteSources,

    findSource: state => source => {
      if(!source || !source.id ) { return null }
      let foundSource = find(state.sources, { id: source.id })
      if(!foundSource) {
        let notFoundError = new Error(`No component source found with id: ${source.id}`)
        notFoundError.code = 'NOT_FOUND'
        throw notFoundError
      }

      return foundSource
    },

    sourceExists: (state, getters) => source => {
      let found = true
      try {
        getters.findSource(source)
      } catch(error) {
        if(error.code === 'NOT_FOUND'){
          found = false
        } else {
          throw error
        }
      }
      return found
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
    setSources(state, { sources }) {
      state.sources = sources
    },

    setRemoteSources(state, sources) {
      state.remoteSources = sources
    },

    createSource(state, { source }) {
      source.id = source.id || uuid()
      state.sources.push(source)
    },

    overwriteSource(state, { existingSource, newSource }) {
      Object.assign(existingSource, newSource)
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
    setActiveComponentSource({ commit, getters }, source) {
      source = getters.findSource(source)
      commit("setComponentSource", { component: getters.activeComponent, source })
    },

    fetchRemoteSources({ commit }) {
      // TODO: set a spinner
      // fetch listing from google
      googleSheets
        .fetchSheets()
        .then(function(sheets) {
          commit("setRemoteSources", sheets)
        })
    },

    importSource({ dispatch }, source) {
      dispatch("createOrUpdateSourceById", source.id)
    },

    createOrUpdateSourceById({ getters, dispatch }, sourceId) {
      // fetch sheet from google
      return googleSheets
        .fetchSheetById(sourceId)
        .then((fetchedSource) => {
          // check if it's new or existing
          if(getters.sourceExists(fetchedSource)) {
            // if we already have it, refresh it
            dispatch("refreshSource", { id: fetchedSource.id, newSource: fetchedSource })
          } else {
            // if we don't have it, add it
            dispatch("addSource", fetchedSource)
          }

          dispatch("setActiveComponentSource", { id: fetchedSource.id })
        })
    },

    addSource({ commit }, source) {
      commit("createSource", { source })
    },

    refreshSource({ commit, getters }, { id, newSource }) {
      let existingSource = getters.findSource({ id })
      commit("overwriteSource", { existingSource, newSource })
    }
  }
}

export default SourcesModule
