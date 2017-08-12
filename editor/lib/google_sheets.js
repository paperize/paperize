import Promise from 'bluebird'
import auth from './auth'

let user = auth.user

const CLIENT_ID      = "991093846081-9fps02e3ijk98hpetv0jvpjqm195as2m.apps.googleusercontent.com"
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES         = "https://www.googleapis.com/auth/spreadsheets";

let getSheetsAPI = (token) => {
  return new Promise((resolve, reject) => {
    if(gapi.client) {
      resolve(gapi.client)
    } else {
      gapi.load('client:auth2', () => {
        return gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId:      CLIENT_ID,
          scope:         SCOPES,
        })

        .then(() => {
          gapi.client.setToken({access_token: token})
          resolve(gapi.client)
        })
      })
    }
  })
}

let loadSheet = function(token, sheetId, range) {
  getSheetsAPI(token).then((api) => {
    api.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    }).then(function(response) {
      let range = response.result;
      if (range.values.length > 0) {
        for (let i = 0; i < range.values.length; i++) {
          var row = range.values[i];
          // work with row
          console.log(row)
        }
      } else {
        console.log('-')
      }
    }, function(response) {
      console.log("Error:", response.result.error.message)
    });
  })
}

export default { loadSheet }
