import { map, zipWith } from 'lodash'

import { generateCrud } from './util/vuex_resource'

const SourceModel = {
  name: 'sources',

  create(fetchedSource) {
    if(!fetchedSource.id) {
      throw new Error("Attempted to import a remote source without an id.")
    }

    return fetchedSource
  },

  state: { },

  getters: {
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

    activeSourceProperties: (_, getters, __, rootGetters) => {
      return rootGetters.activeSource &&
        getters.sourceProperties(rootGetters.activeSource)
    }
  },

  mutations: { },

  actions: {
    downloadAndSaveSource({ dispatch }, remoteSourceId) {
      // fetch sheet from google
      return dispatch("googleFetchSheetById", remoteSourceId)
        .then((fetchedSource) => {
          return dispatch("createOrUpdateSource", fetchedSource)
        })
    },

    createOrUpdateSource({ commit, getters }, source) {
      // bump the refresh time
      source.refreshedAt = Date.now()
      // check if it's new or existing
      if(getters.sourceExists(source.id)) {
        // if we already have it, refresh it
        commit("updateSource", source)
      } else {
        // if we don't have it, add it
        commit("createSource", source)
      }

      return Promise.resolve(source.id)
    },
  }
}

const SourcesModule = generateCrud(SourceModel)

export default SourcesModule
