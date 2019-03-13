import { map, pick, zipWith } from 'lodash'
import { generateCrud } from './util/vuex_resource'

const SheetModel = {
  name: 'sheets',

  create(newSheet) {
    return {
      ...pick(newSheet, [
        "id",
        "name",
        "parents"
      ]),

      refreshedAt: null, /* starts unrefreshed */
      worksheets: [/* empty til refreshed */],
    }
  },

  getters: {
    worksheetValues: (state, getters, _, rootGetters) => (sheetId, worksheetId) => {
      return rootGetters.sheetValues(sheetId, worksheetId)
        || []
    },

    worksheetTitles: (state, getters) => sheetId => {
      const { worksheets } = getters.findSheet(sheetId),
        worksheetTitles = map(worksheets, "title")

      return worksheetTitles
    },

    worksheetPropertyNames: (state, getters) => (sheetId, worksheetId) => {
      const values = getters.worksheetValues(sheetId, worksheetId)

      // First row is the property names
      return values[0] || []
    },

    worksheetPropertyValues: (state, getters) => (sheetId, worksheetId) => {
      if(!sheetId || (!worksheetId && worksheetId != 0)) { return }
      const values = getters.worksheetValues(sheetId, worksheetId)

      // Every row after the first are the value rows
      if(values.length > 1) {
        return values.slice(1) || []
      }

      return []
    },

    worksheetItems: (state, getters) => (sheetId, worksheetId) => {
      const propertyNames = getters.worksheetPropertyNames(sheetId, worksheetId),
        propertyValues = getters.worksheetPropertyValues(sheetId, worksheetId)

      return map(propertyValues, (row) => {
        return zipWith(propertyNames, row, (key, value) => {
          return { key, value }
        })
      })
    },
  },

  mutations: { },

  actions: {
    ensureSheetRefreshed({ dispatch, getters, rootGetters }, sheetId) {
      const sheet = getters.findSheet(sheetId)
      // check the store cache
      if(rootGetters.allSheetsCached(sheet)){
        return
      } else {
        // check the idb cache
        return dispatch("loadIDBCache", sheet)
          .then((success) => {
            if(!success) {
              // fetch from web
              return dispatch("refreshSheetNow", sheetId)
            }
          })
      }
    },

    refreshSheetNow({ dispatch }, sheetId) {
      return dispatch("googleFetchSheetById", sheetId)
        .then(({ worksheets }) => {
          // add the worksheet metadata to the sheet
          return dispatch("patchSheet", {
            id: sheetId,
            worksheets: map(worksheets, (worksheet) => {
              return pick(worksheet, ["id", "title"])
            }),
            refreshedAt: Date.now()

          }).then(() => {
            // specially cache the heavy part
            return dispatch("cacheSheet", {
              sheetId,
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
