import Promise from 'bluebird'

const CLIENT_ID      = "991093846081-9fps02e3ijk98hpetv0jvpjqm195as2m.apps.googleusercontent.com"
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", // Drive
  "https://sheets.googleapis.com/$discovery/rest?version=v4"    // Sheets
]
const SCOPES         = "email https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets"

let clientLoadedPromise = null
let ensureClientLoaded = function() {
  if(!clientLoadedPromise) {
    clientLoadedPromise = new Promise((resolve, reject) => {
      gapi.load('client:auth2', {
        callback() { // Handle gapi.client initialization.
          resolve()
        },
        onerror() { // Handle loading error.
          reject(new Error('gapi.client failed to load!'))
        },
        timeout: 5000, // 5 seconds.
        ontimeout() { // Handle timeout.
          reject(new Error('gapi.client could not load in a timely manner!'))
        }
      })
    })
  }

  return clientLoadedPromise
}

let initClientPromise = null
let initClientAndAuth2 = function() {
  if(!initClientPromise) {
    initClientPromise = new Promise((resolve, reject) => {
      return ensureClientLoaded().then(() => {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          client_id: CLIENT_ID,
          scope:     SCOPES
        }).then(() => {
          resolve()
        }, (error) => {
          reject(error)
        })
      })
    })
  }

  return initClientPromise
}

let getClient = function(callback) {
  return initClientAndAuth2().then(() => {
    callback(gapi.client)
  })
}

let getAuth2 = function(callback) {
  initClientAndAuth2().then(() => {
    callback(gapi.auth2.getAuthInstance())
  })
}

let api = { getClient, getAuth2 }

if(process.env.NODE_ENV === 'test') {
  window.auth = api
}

export default api
