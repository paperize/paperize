/* global gapi, google */
import { getKey } from '../keys.js'
import jwtDecode from 'jwt-decode'

const
  CLIENT_ID = getKey("google", "client_id"),
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", // Drive
    "https://sheets.googleapis.com/$discovery/rest?version=v4"    // Sheets
  ],
  // Paperize can create files & folders in Drive
  // Paperize can only see & edit files & folders it created
  SCOPES = "email https://www.googleapis.com/auth/drive.file"

let loginPromiseResolve
const loginPromise = new Promise((resolve) => {
  loginPromiseResolve = resolve
})

let tokenClient
(async () => {
  // wait for js file to be loaded in index.html
  await window.gapiLoadPromise
  await new Promise((resolve, reject) => {
    gapi.load('client:picker', { callback: resolve, onerror: reject })
  })
  await gapi.client.init({})
  DISCOVERY_DOCS.forEach( async discoDoc => {
    await gapi.client.load(discoDoc)
  })

  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: async response => {
      const { name, email, picture } = jwtDecode(response.credential)
      loginPromiseResolve({ name, email, picture })
    }
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
})()

let accessToken
const getAccessToken = () => accessToken
const refreshAccessToken = async () => new Promise((resolve, reject) => {
  tokenClient.callback = resp => {
    if(resp.error) { return reject(resp) }

    // store the new access token so others can look it up (picker)
    accessToken = resp.access_token
    resolve(resp)
  }

  tokenClient.requestAccessToken()
})


// wrap client usage with automatic catch and token refresh
const getClient = async tryUsingClient => {
  if(!gapi.client) { throw new Error("gapi.client not loaded") }

  try {
    return await tryUsingClient(gapi.client)

  } catch(err) {
    if (![401, 403].includes(err.result.error.code)) { throw err }

    // The access token is missing or invalid, prompt for consent
    await refreshAccessToken()

    return await tryUsingClient(gapi.client)
  }
}

const signIn = function() {
  google.accounts.id.prompt(notification => {
    const
      notDisplayed = notification.isNotDisplayed(),
      skippedMoment = notification.isSkippedMoment()

    if(notDisplayed || skippedMoment) {
      // clear the exponential backoff cookie and retry immediately
      document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
      google.accounts.id.prompt()
    }
  })
}

const signOut = function() {
  google.accounts.id.disableAutoSelect()
  return Promise.reject("No more signOut")

  // const auth2 = gapi.auth2.getAuthInstance()
  // return auth2.signOut()
}

const revokeAccess = function() {
  return Promise.reject("No more revokeAccess")
}

export default { loginPromise, getClient, getAccessToken, signIn, signOut, revokeAccess }
export { loginPromise, getClient, getAccessToken, signIn, signOut, revokeAccess }
