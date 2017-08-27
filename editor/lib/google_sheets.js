import Promise from 'bluebird'
import auth from './auth'

// Via: https://stackoverflow.com/questions/16840038/easiest-way-to-get-file-id-from-url-on-google-apps-script
const GOOGLE_ID_REGEX = /[-\w]{25,}/
let matchGoogleId = (url) => url.match(GOOGLE_ID_REGEX)

let BadIdError = function() {}
BadIdError.prototype = Object.create(Error.prototype);

let NotFoundError = function(googleId) {
  this.googleId = googleId
  return this
}
NotFoundError.prototype = Object.create(Error.prototype);

let api = {
  BadIdError, NotFoundError,

  fetchSheetById(sheetId) {
    return new Promise((resolve, reject) => {
      let googleId = matchGoogleId(sheetId)
      // error out from id parse failure
      if(!googleId){
        reject(new BadIdError())
        return
      }

      auth.getClient((client) => {
        return client.drive.files.get({
          fileId: googleId
        }).then((driveResponse) => {
          // sheet exists, fetch its name
          let driveResult = driveResponse.result
          return client.sheets.spreadsheets.values.get({
            spreadsheetId: googleId,
            range: 'Sheet1' // TODO: Can't rely on this in reality
          }).then((sheetsResponse) => {
            let sheetsResult = sheetsResponse.result
            // resolve with the sheet metadata and data
            resolve({
              id:   driveResult.id,
              name: driveResult.name,
              data: sheetsResult
            })
          })
        }, (error) => {
          if(error.status == 404) {
            reject(new NotFoundError(googleId))
          } else {
            reject(error)
          }
        })
      })
    })
  }
}

if(process.env.NODE_ENV == 'test'){
  window.googleSheets = api
}

export default api
