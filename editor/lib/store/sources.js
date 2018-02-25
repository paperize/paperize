import { map, zipWith } from 'lodash'

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

  mutations: {
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
