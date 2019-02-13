/* global process */
import { map, reduce, take } from 'lodash'

import { getClient } from './auth'
import { matchGoogleId } from './util'

const BadIdError = function(sheetId) {
  this.message = `No Google Sheet ID detected in "${sheetId}"`
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

  fetchSheetById(sheetId) {
    return new Promise((resolve, reject) => {
      let googleId = matchGoogleId(sheetId)
      // error out from id parse failure
      if(!googleId){
        reject(new BadIdError(sheetId))
        return
      }

      getClient((client) => {
        // worksheet names
        return client.sheets.spreadsheets.get({
          spreadsheetId: googleId
        }).then(({ result }) => {
          // extract spreadsheet name and all worksheet names
          const spreadsheetName = result.properties.title,
            worksheetNames = take(map(result.sheets, "properties.title"), MAX_WORKSHEETS),

            // construct batch query
            params = {
              spreadsheetId: googleId,
              ranges: worksheetNames
            }

          return client.sheets.spreadsheets.values.batchGet(params)
            .then(({ result }) => {
              // creates:
              // {
              //   Sheet1: [['row1cell1', 'row1cell2'], ['row2cell1', 'row2cell2']]
              // }
              const worksheets = map(worksheetNames, (name, index) => {
                return {
                  id: name,
                  values: result.valueRanges[index].values
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
        return client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: googleId,
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  index: 0
                }
              }
            }
          ]
        }).then(({ status, statusText }) => {
          if(status === 200){
            resolve(true)
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
