/* global gapi process */


const CLIENT_ID      = "991093846081-9fps02e3ijk98hpetv0jvpjqm195as2m.apps.googleusercontent.com"
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", // Drive
  "https://sheets.googleapis.com/$discovery/rest?version=v4"    // Sheets
]
const SCOPES         = "email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets"

let clientLoadedPromise = null
const ensureClientLoaded = function() {
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
const initClientAndAuth2 = function() {
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

const getClient = function(callback) {
  return initClientAndAuth2().then(() => {
    callback(gapi.client)
  })
}

const getAuth2 = function(callback) {
  return initClientAndAuth2().then(() => {
    callback(gapi.auth2.getAuthInstance())
  })
}

const registerSignInListener = function(listener) {
  return new Promise((resolve) => {
    getAuth2((auth2) => {
      auth2.isSignedIn.listen(listener)
      resolve()
    })
  })
}

const isSignedIn = function() {
  return new Promise((resolve) => {
    getAuth2((auth2) => {
      resolve(auth2.isSignedIn.get())
    })
  })
}

const googleUserProfileObject = function(googleUser) {
  const profile = googleUser.getBasicProfile()
  return {
    name:     profile.getName(),
    email:    profile.getEmail(),
    imageUrl: profile.getImageUrl()
  }
}

const getCurrentUser = function() {
  return new Promise((resolve) => {
    getAuth2((auth2) => {
      const googleUser = auth2.currentUser.get()
      resolve(googleUser)
    })
  })
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
  return new Promise((resolve, reject) => {
    getAuth2((auth2) => {
      auth2.signIn().then(
        (googleUser) => {
          resolve(googleUserProfileObject(googleUser))
        },

        (error) => { reject(new Error(error.error)) }
      )
    })
  })
}

const signOut = function() {
  return getAuth2(auth2 => auth2.signOut())
}

let api = { getClient, isSignedIn, signIn, signOut }

if(process.env.NODE_ENV === 'test' && typeof window !== 'undefined') {
  window.auth = api
}

export default { getClient, registerSignInListener, isSignedIn, getCurrentUser, signIn, signOut }
export { getClient, registerSignInListener, isSignedIn, getCurrentUser, signIn, signOut }
