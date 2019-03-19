import { map, max, min, pick, slice, zipWith } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const pickFieldsFromResponse = function(givenSheet) {
  return pick(givenSheet, [
    "id",
    "name",
    "parents"
  ])
}

const SpreadsheetModel = {
  name: 'spreadsheets',

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
      const { worksheets } = getters.findSpreadsheet(spreadsheetId),
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

    worksheetItems: (state, getters) => (spreadsheetId, worksheetId, firstRow, lastRow) => {
      firstRow = firstRow || 0
      if(lastRow != 0){
        lastRow = lastRow || Infinity
      }

      const propertyNames = getters.worksheetPropertyNames(spreadsheetId, worksheetId),
        propertyValues = getters.worksheetPropertyValues(spreadsheetId, worksheetId)

      firstRow = max([0, firstRow])
      lastRow = min([propertyValues.length, lastRow+1])

      const slicedPropertyValues = slice(propertyValues, firstRow, lastRow)

      return map(slicedPropertyValues, (row) => {
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
          return dispatch("patchSpreadsheet", pickFieldsFromResponse(sheetRecord))
        })

        .then(() => {
          return dispatch("refreshSheetIndex", spreadsheetId)
        })
    },

    ensureSheetIndexed({ dispatch, getters, rootGetters }, spreadsheetId) {
      const sheet = getters.findSpreadsheet(spreadsheetId)
      // check the store cache
      if(rootGetters.allSpreadsheetsCached(sheet)){
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
          return dispatch("patchSpreadsheet", {
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

const SpreadsheetModule = generateCrud(SpreadsheetModel)

export default SpreadsheetModule
