import Vue from 'vue'
import { find, map, zipWith } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './vuex_resource'

const SourceModel = {
  name: 'sources',

  create(fetchedSource) {
    if(!fetchedSource.id) {
      throw new Error("Attempted to import a remote source without and id.")
    }

    return fetchedSource
  },

  state: {
    remoteSources: []
  },

  getters: {
    remoteSources: state => state.remoteSources,

    sourceExists: (state, getters) => sourceId => {
      let found = true
      try {
        getters.findSource(sourceId)
      } catch(error) {
        if(error.code === 'NOT_FOUND'){
          found = false
        } else {
          throw error
        }
      }
      return found
    },

    getSourceItems: (state, getters) => source => {
      const propertyNames = getters.sourceProperties(source),
        valuesWithoutHeader = source.data.values.slice(1)

      return map(valuesWithoutHeader, (row) => {
        return zipWith(propertyNames, row, (key, value) => {
          return { key, value }
        })
      })
    },

    sourceProperties: (state, getters) => source => {
      source = getters.findSource(source.id)
      let theProperties = source.data.values[0]

      return theProperties
    },

    sourcePropertyExamples: (_, getters) => (source, propertyName) => {
      let propertyIndex = getters.sourceProperties(source).indexOf(propertyName)

      return chain(source.data.values)
        .map((row) => row[propertyIndex])
        .compact()
        .slice(1, 4)
        .map((content) => truncate(content, { length: 24, separator: /,? +/ }))
        .join(', ')
      .value()
    },

    activeSourceProperties: (_, getters, __, rootGetters) => {
      return rootGetters.activeSource &&
        getters.sourceProperties(rootGetters.activeSource)
    },

    activeSourcePropertyExamples: (_, getters, __, rootGetters) => (propertyName) => {
      return rootGetters.activeSource &&
        getters.sourcePropertyExamples(rootGetters.activeSource, propertyName) ||
        []
    }
  },

  mutations: {
    setSources(state, sources) {
      state.sources = sources
    },

    setRemoteSources(state, sources) {
      state.remoteSources = sources
    },
  },

  actions: {
    fetchRemoteSources({ commit, dispatch }) {
      // fetch listing from google
      dispatch("fetchSheets")
        .then(sheets => commit("setRemoteSources", sheets))
    },

    importRemoteSource({ dispatch }, remoteSourceId) {
      return dispatch("createOrUpdateSourceById", remoteSourceId)
    },

    createOrUpdateSourceById({ getters, dispatch, commit }, remoteSourceId) {
      // fetch sheet from google
      return dispatch("fetchSheetById", remoteSourceId)
        .then((fetchedSource) => {
          // check if it's new or existing
          if(getters.sourceExists(fetchedSource.id)) {
            // if we already have it, refresh it
            commit("updateSource", fetchedSource)
          } else {
            // if we don't have it, add it
            commit("createSource", fetchedSource)
          }

          dispatch("updateComponent", { ...getters.activeComponent, sourceId: fetchedSource.id })
          return null
        })
    },
  }
}

const SourcesModule = generateCrud(SourceModel)

export default SourcesModule
