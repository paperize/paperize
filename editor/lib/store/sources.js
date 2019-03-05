import { find, map, zipWith } from 'lodash'

import { generateCrud } from './util/vuex_resource'

/*
  sources: [
    {
      id: 'abc-google-id-xyz',
      name: 'Spreadsheet Name'
      worksheets: [
        {
          id: 'Worksheet Name',
          values: [
            ['row1value1', 'row1value2'],
            ['row2value1', 'row2value2'],
            ['row3value1', 'row3value2'],
          ]
        }
      ]
    }
  ]
*/

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
    getSourceWorksheetNames: (state, getters) => sourceId => {
      const source = getters.findSource(sourceId),
        worksheetNames = map(source.worksheets, "id")

      return worksheetNames
    },

    findSourceWorksheet: (state, getters) => (sourceId, worksheetId) => {
      const source = getters.findSource(sourceId),
        worksheet = find(source.worksheets, { id: worksheetId })

      return worksheet
    },

    getSourceWorksheetItems: (state, getters) => (source, worksheetId) => {
      // Default to first worksheet if none given
      worksheetId = worksheetId || source.worksheets[0].id

      const propertyNames = getters.sourceProperties(source),
        worksheet = (propertyNames.length > 0) && getters.findSourceWorksheet(source.id, worksheetId),
        valuesWithoutHeader = worksheet.values && worksheet.values.slice(1)

      if(valuesWithoutHeader) {
        return map(valuesWithoutHeader, (row) => {
          return zipWith(propertyNames, row, (key, value) => {
            return { key, value }
          })
        })
      } else {
        return []
      }
    },

    sourceProperties: (state, getters) => source => {
      source = getters.findSource(source.id)
      let theProperties = []

      if(source.worksheets[0] && source.worksheets[0].values) {
        theProperties = source.worksheets[0].values[0]
      }

      return theProperties
    },
  },

  mutations: { },

  actions: {
    downloadAndSaveSource({ dispatch }, remoteSourceId) {
      // fetch sheet from google
      return Promise.all([
        dispatch("googleFetchSheetById", remoteSourceId)
          .then((fetchedSource) => {
            return dispatch("createOrUpdateSource", fetchedSource)
          }),

        dispatch("googleGetRecord", remoteSourceId)
          .then((sheetRecord) => {
            return dispatch("createSheet", sheetRecord)
          })
      ]).spread((sourceId) => {
        return sourceId
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
