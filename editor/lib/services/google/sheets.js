/* global process */
import { map } from 'lodash'

import { getClient } from './auth'
import { matchGoogleId } from './util'

let BadIdError = function(sheetId) {
  this.message = `No Google Sheet ID detected in "${sheetId}"`
}
BadIdError.prototype = Object.create(Error.prototype)

let NotFoundError = function(googleId) {
  this.message = `No Google Sheet found for ID: "${googleId}"`
  this.googleId = googleId
  return this
}
NotFoundError.prototype = Object.create(Error.prototype)

let api = {
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
        return client.sheets.spreadsheets.get({
          spreadsheetId: googleId
        }).then(({ result }) => {
          let spreadsheetName = result.properties.title
          let sheetsNames = map(result.sheets, "properties.title")
          return client.sheets.spreadsheets.values.get({
            spreadsheetId: googleId,
            range:         sheetsNames[0] // Entire first sheet
          }).then((sheetsResponse) => {
            let sheetsResult = sheetsResponse.result
            // resolve with the sheet metadata and data
            resolve({
              id:   googleId,
              name: spreadsheetName,
              data: sheetsResult
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
  }
}


if(process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  window.googleSheets = api
}

export default api
