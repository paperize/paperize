import { map, pick } from 'lodash'

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

  fetchSheets() {
    return new Promise((resolve, reject) => {
      getClient((client) => {
        client.drive.files.list({
          // Query for spreadsheets only
          q: "mimeType='application/vnd.google-apps.spreadsheet'",
          // Order them by most recent (seems to be most relevant)
          orderBy: "recency desc"
        }).then((driveResponse) => {
          let driveResult = driveResponse.result
          let fileIdsAndNames = map(driveResult.files, (file) => pick(file, [ "id", "name" ]) )
          resolve(fileIdsAndNames)
        }, (driveError) => {
          reject(new Error(driveError.result.error.message))
        })
      })
    })
  },

  fetchSheetData(sheet) {
    return new Promise((resolve) => {
      getClient((client) => {
        return client.sheets.spreadsheets.values.get({
          spreadsheetId: sheet.id,
          range:         'Sheet1' // TODO: Can't rely on this in reality
        }).then((sheetsResponse) => {
          let sheetsResult = sheetsResponse.result
          // resolve with the sheet metadata and data
          resolve({
            ...sheet,
            data: sheetsResult
          })
        })
      })
    })
  },

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

if(process.env.NODE_ENV == 'test' && typeof window !== 'undefined') {
  window.googleSheets = api
}

export default api
