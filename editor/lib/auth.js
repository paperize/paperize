import config from './config'

const AUTH0_CLIENT_ID    = 'hgqnKQas6FWes8vnrpM6ig4Y5e4PzGJU'
const AUTH0_DOMAIN       = 'paperize.auth0.com'
const AUTH0_CALLBACK_URL = location.href
const LOCAL_STORAGE_KEY  = 'id_token'

let profileCallback = null
let profileMemo = null

const lock = new config.Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN)

let callbackForProfile = () => {
  // Have a profile? Have a callback? Call the callback with the profile!
  profileMemo && profileCallback && profileCallback(profileMemo)
}

let whenProfileIsSet = (newProfileCallback) => {
  profileCallback = newProfileCallback
  callbackForProfile()
}

let checkForProfile = () => {
  let id_token = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        return alert('There was an error getting the profile: ' + err.message)
      }
      // Display user information
      profileMemo = profile
      callbackForProfile()
    })
  }
}

let promptForLogin = () => {
  lock.show()
}

let logout = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
  profileMemo = null
}

lock.on("authenticated", (authResult) => {
  lock.getProfile(authResult.idToken, (error, profile) => {
    if (error) {
      // Handle error
      console.error("Error fetching User ID Token: ", error)
      return
    }
    // Store the user
    localStorage.setItem(LOCAL_STORAGE_KEY, authResult.idToken)
    // Display user information
    profileMemo = profile
    callbackForProfile()
  })
})

// Go ahead and check as soon as we're loaded
checkForProfile()

export default { whenProfileIsSet, checkForProfile, promptForLogin, logout }
