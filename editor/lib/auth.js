import Promise from 'bluebird'

const CLIENT_ID      = "991093846081-9fps02e3ijk98hpetv0jvpjqm195as2m.apps.googleusercontent.com"
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
const SCOPES         = "email https://www.googleapis.com/auth/spreadsheets"

// // Lock
// if(process.env['NODE_ENV'] === 'test') {
//   Auth0Lock = function() {
//     // short circuit getProfile in test
//     return {
//       getProfile(idToken, callback) {
//         console.log("Profile requested for token:", idToken)
//         callback(null, {
//           nickname: 'Test User',
//           picture: 'http://placehold.it/40/40'
//         })
//       },
//
//       show () { },
//       on () { }
//     }
//   }
// }
//
// let options = {
//   auth: {
//     params: {
//       access_type: "offline" // Causes Google to provide a refresh token
//     }
//   }
// }
//
// const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, options)
//
// lock.promptForLogin = () => {
//   lock.show()
// }
//
// if(process.env['NODE_ENV'] === 'test') {
//   window.lock = lock
// }

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

export default { getClient, getAuth2 }
