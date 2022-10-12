/* global gapi, google */
import { getKey } from '../keys.js'

const
  CLIENT_ID = getKey("google", "client_id"),
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", // Drive
    "https://sheets.googleapis.com/$discovery/rest?version=v4"    // Sheets
  ],
  SCOPES = [
    "email",

    // Paperize can create files & folders in Drive
    // Paperize can only see & edit files & folders it created
    "https://www.googleapis.com/auth/drive.file",

  ].join(" ")

let tokenClient
(async () => {
  console.log('starting async func')
  // wait for js file to be loaded in index.html
  await window.gapiLoadPromise
  await new Promise((resolve, reject) => {
    gapi.load('client', { callback: resolve, onerror: reject })
  })
  await gapi.client.init({})
  DISCOVERY_DOCS.forEach( async discoDoc => {
    await gapi.client.load(discoDoc)
  })

  // Now load the GIS client
  await window.gisLoadPromise
  await new Promise( resolve => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      prompt: 'consent',
      callback: '',  // defined at request time in await/promise scope.
    })
    resolve()
  })


  // TODO: this stuff works, break it down and make it automatic for all api calls

  // delay until the client is ready
  // await new Promise( resolve => setTimeout(resolve, 600) )

  // const resp = await gapi.client.sheets.spreadsheets.get({
  //   spreadsheetId: "1LoIa0UI3tTWI1fPoZSQ3f4-IwIQSWSnXdvLho2bJ5rA"
  // }).then(console.log).catch( async err => {
  //   if (err.result.error.code == 401 || (err.result.error.code == 403) &&
  //       (err.result.error.status == "PERMISSION_DENIED")) {

  //     // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
  //     await new Promise((resolve, reject) => {
  //       try {
  //         // Settle this promise in the response callback for requestAccessToken()
  //         tokenClient.callback = (resp) => {
  //           if (resp.error !== undefined) {
  //             reject(resp)
  //           }
  //           // GIS has automatically updated gapi.client with the newly issued access token.
  //           console.log('gapi.client access token: ' + JSON.stringify(gapi.client.getToken()))
  //           resolve(resp)
  //         }
  //         tokenClient.requestAccessToken()
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     })
  //     return await gapi.client.sheets.spreadsheets.get({
  //       spreadsheetId: "1LoIa0UI3tTWI1fPoZSQ3f4-IwIQSWSnXdvLho2bJ5rA"
  //     })
  //   } else {
  //     // Errors unrelated to authorization: server errors, exceeding quota, bad requests, and so on.
  //     throw new Error(err)
  //   }
  // })
})()

let clientLoadedPromise = null
const ensureClientLoaded = function() {
  if(!clientLoadedPromise) {
    clientLoadedPromise = new Promise((resolve, reject) => {
      gapi.load('client:picker', {
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


// let initClientPromise = null
// const initClientAndAuth2 = function() {
//   if(!initClientPromise) {
//     initClientPromise = new Promise((resolve, reject) => {
//       return ensureClientLoaded().then(() => {
//         gapi.client.init({
//           discoveryDocs: DISCOVERY_DOCS,
//           client_id: CLIENT_ID,
//           scope:     SCOPES
//         }).then(() => {
//           resolve()
//         }, (error) => {
//           reject(error)
//         })
//       })
//     })
//   }

//   return initClientPromise
// }

// let clientPromise
const getClient = function() {
  throw new Error("No more getClient")
  // if(!clientPromise) {
  //   clientPromise = new Promise(resolve => {
  //   })
  // }

  // return clientPromise
}

const getAuth2 = function(callback) {
  return Promise.reject("No more getAuthInstance")
  // return initClientAndAuth2().then(() => {
  //   callback(gapi.auth2.getAuthInstance())
  // })
}

const registerSignInListener = function(listener) {
  return new Promise(() => listener(true))
  // return Promise.reject("No more isSignedIn.listen")
  // return new Promise((resolve) => {
  //   getAuth2((auth2) => {
  //     auth2.isSignedIn.listen(listener)
  //     resolve()
  //   })
  // })
}

const isSignedIn = function() {
  return new Promise( resolve => resolve(true) )
  // return Promise.reject("No more isSignedIn.get")
  // return new Promise((resolve) => {
  //   getAuth2((auth2) => {
  //     resolve(auth2.isSignedIn.get())
  //   })
  // })
}

const getAccessToken = function() {
  return new Promise((resolve) => {
    getCurrentUser().then((currentUser) => {
      const authResponse = currentUser.getAuthResponse(true)
      resolve(authResponse.access_token)
    })
  })
}

const googleUserProfileObject = function(googleUser) {
  throw new Error("getBasicProfile() deprecated")
  // const profile = googleUser.getBasicProfile()
  // return {
  //   name:     profile.getName(),
  //   email:    profile.getEmail(),
  //   imageUrl: profile.getImageUrl()
  // }
}

const getCurrentUser = function() {
  return Promise.reject("No more currentUser.get")
  // return new Promise((resolve) => {
  //   getAuth2((auth2) => {
  //     const googleUser = auth2.currentUser.get()
  //     resolve(googleUser)
  //   })
  // })
}

const getCurrentUserProfile = function() {
  return new Promise((resolve) => {
    getCurrentUser().then((googleUser) => {
      const profile = googleUserProfileObject(googleUser)
      resolve(profile)
    })
  })
}

const signIn = function() {
  return Promise.reject("No more signIn")
  // return new Promise((resolve, reject) => {
  //   getAuth2((auth2) => {
  //     auth2.signIn().then(
  //       (googleUser) => {
  //         resolve(googleUserProfileObject(googleUser))
  //       },

  //       (error) => { reject(new Error(error.error)) }
  //     )
  //   })
  // })
}

const signOut = function() {
  return Promise.reject("No more signOut")
  // return getAuth2(auth2 => auth2.signOut())
}

const revokeAccess = function() {
  return getAuth2(auth2 => auth2.disconnect())
}

export default { getClient, registerSignInListener, isSignedIn, getCurrentUser, getCurrentUserProfile, getAccessToken, signIn, signOut, revokeAccess }
export { getClient, registerSignInListener, isSignedIn, getCurrentUser, getCurrentUserProfile, getAccessToken, signIn, signOut, revokeAccess }
