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

      refreshedAt: Date.now()
    }
  },

  getters: {
    findWorksheet: (state, getters) => (sheetId, worksheetId) => {
      const sheet = getters.findSheet(sheetId)

      if(worksheetId) {
        return find(sheet.worksheets, { id: worksheetId })
      } else {
        return sheet.worksheets[0]
      }
    },

    worksheetNames: (state, getters) => sheetId => {
      const sheet = getters.findSheet(sheetId),
        worksheetNames = map(sheet.worksheets, "id")

      return worksheetNames
    },

    worksheetProperties: (state, getters) => (sheetId, worksheetId) => {
      const worksheet = getters.findWorksheet(sheetId, worksheetId)
      let theProperties = []

      if(worksheet && worksheet.values) {
        // First row is the property names
        theProperties = worksheet.values[0]
      }

      return theProperties
    },

    worksheetItems: (state, getters) => (sheetId, worksheetId) => {
      // Default to first worksheet if none given
      // worksheetId = worksheetId || sheet.worksheets[0].id

      const propertyNames = getters.worksheetProperties(sheetId, worksheetId),
        worksheet = (propertyNames.length > 0) && getters.findWorksheet(sheetId, worksheetId),
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
  },

  mutations: { },

  actions: { }
}

const SheetsModule = generateCrud(SheetModel)

export default SheetsModule
