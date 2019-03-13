import { map, pick, zipWith } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const pickFieldsFromResponse = function(givenSheet) {
  return pick(givenSheet, [
    "id",
    "name",
    "parents"
  ])
}

const SheetModel = {
  name: 'sheets',

  create(newSheet) {
    return {
      ...pickFieldsFromResponse(newSheet),
      refreshedAt: null, /* starts unrefreshed */
      worksheets: [/* empty til refreshed */],
    }
  },

  getters: {
    worksheetValues: (state, getters, _, rootGetters) => (spreadsheetId, worksheetId) => {
      return rootGetters.sheetValues(spreadsheetId, worksheetId)
        || []
    },

    worksheetTitles: (state, getters) => spreadsheetId => {
      const { worksheets } = getters.findSheet(spreadsheetId),
        worksheetTitles = map(worksheets, "title")

      return worksheetTitles
    },

    worksheetPropertyNames: (state, getters) => (spreadsheetId, worksheetId) => {
      if(!spreadsheetId || !worksheetId) { return [] }
      const values = getters.worksheetValues(spreadsheetId, worksheetId)

      // First row is the property names
      return values[0] || []
    },

    worksheetPropertyValues: (state, getters) => (spreadsheetId, worksheetId) => {
      if(!spreadsheetId || !worksheetId) { return [] }
      const values = getters.worksheetValues(spreadsheetId, worksheetId)

      // Every row after the first are the value rows
      if(values.length > 1) {
        return values.slice(1) || []
      }

      return []
    },

    worksheetItems: (state, getters) => (spreadsheetId, worksheetId) => {
      const propertyNames = getters.worksheetPropertyNames(spreadsheetId, worksheetId),
        propertyValues = getters.worksheetPropertyValues(spreadsheetId, worksheetId)

      return map(propertyValues, (row) => {
        return zipWith(propertyNames, row, (key, value) => {
          return { key, value }
        })
      })
    },
  },

  mutations: { },

  actions: {
    refreshSheetRecord({ dispatch }, spreadsheetId) {
      return dispatch("googleGetRecord", spreadsheetId)
        .then((sheetRecord) => {
          return dispatch("patchSheet", pickFieldsFromResponse(sheetRecord))
        })

        .then(() => {
          return dispatch("refreshSheetIndex", spreadsheetId)
        })
    },

    ensureSheetIndexed({ dispatch, getters, rootGetters }, spreadsheetId) {
      const sheet = getters.findSheet(spreadsheetId)
      // check the store cache
      if(rootGetters.allSheetsCached(sheet)){
        return
      } else {
        // check the idb cache
        return dispatch("loadIDBCache", sheet)
          .then((success) => {
            if(!success) {
              // fetch from web
              return dispatch("refreshSheetIndex", spreadsheetId)
            }
          })
      }
    },

    refreshSheetIndex({ dispatch }, spreadsheetId) {
      return dispatch("googleFetchSheetById", spreadsheetId)
        .then(({ worksheets }) => {
          // add the worksheet metadata to the sheet
          return dispatch("patchSheet", {
            id: spreadsheetId,
            worksheets: map(worksheets, (worksheet) => {
              return pick(worksheet, ["id", "title"])
            }),
            refreshedAt: Date.now()

          }).then(() => {
            // specially cache the heavy part
            return dispatch("cacheSheet", {
              spreadsheetId,
              worksheets: map(worksheets, (worksheet) => {
                return pick(worksheet, ["id", "values"])
              })
            })
          })
        })
    }
  }
}

const SheetsModule = generateCrud(SheetModel)

export default SheetsModule
