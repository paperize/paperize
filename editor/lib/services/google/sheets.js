/* global process */
import { chain, map, take } from 'lodash'

import { getClient } from './auth'
import { matchGoogleId } from './util'

const BadIdError = function(spreadsheetId) {
  this.message = `No Google Sheet ID detected in "${spreadsheetId}"`
}
BadIdError.prototype = Object.create(Error.prototype)

const NotFoundError = function(googleId) {
  this.message = `No Google Sheet found for ID: "${googleId}"`
  this.googleId = googleId
  return this
}
NotFoundError.prototype = Object.create(Error.prototype)

const MAX_WORKSHEETS = 20

const api = {
  BadIdError, NotFoundError,

  matchGoogleId,

  fetchSheetById(spreadsheetId) {
    return new Promise((resolve, reject) => {
      let googleId = matchGoogleId(spreadsheetId)
      // error out from id parse failure
      if(!googleId){
        reject(new BadIdError(spreadsheetId))
        return
      }

      getClient((client) => {
        // worksheet names
        return client.sheets.spreadsheets.get({
          spreadsheetId: googleId
        }).then(({ result }) => {
          // extract spreadsheet name
          const spreadsheetName = result.properties.title,
            // extract worksheet ids
            worksheetIds = chain(result.sheets)
              .take(MAX_WORKSHEETS)
              .map("properties.sheetId")
              .invokeMap("toString")
              .value(),
            // extract worksheet titles
            worksheetTitles = chain(result.sheets)
              .take(MAX_WORKSHEETS)
              .map("properties.title")
              .value(),
            // construct batch query
            params = {
              spreadsheetId: googleId,
              // A sheet title is a valid A1 query
              ranges: worksheetTitles
            }

          return client.sheets.spreadsheets.values.batchGet(params)
            .then(({ result }) => {
              const worksheets = map(result.valueRanges, ({ values = [] }, index) => {
                return {
                  id: worksheetIds[index],
                  title: worksheetTitles[index],
                  values
                }
              })

              resolve({
                id:   result.spreadsheetId,
                name: spreadsheetName,
                worksheets
              })
            })
        }, (error) => {
          if(error.status == 404) {
            reject(new NotFoundError(googleId))
          } else {
            reject(new Error(error.result.error.message))
          }
        })
      })
    })
  },

  addSheetToSpreadsheet(spreadsheetId, sheetName) {
    return new Promise((resolve, reject) => {
      let googleId = matchGoogleId(spreadsheetId)
      // error out from id parse failure
      if(!googleId){
        reject(new BadIdError(spreadsheetId))
        return
      }

      getClient((client) => {
        // worksheet names
        const sheetId = Date.now() % 2000000000
        return client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: googleId,
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  index: 0,
                  sheetId
                }
              }
            }
          ]
        }).then(({ status, statusText }) => {
          if(status === 200){
            resolve(sheetId.toString())
          } else {
            reject(new Error(statusText))
          }
        })
      })
    })
  }
}


if(process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  window.googleSheets = api
}

export default api
