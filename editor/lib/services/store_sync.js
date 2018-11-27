// Store Sync
// Synchronize data between Vuex, ~~Pouch~~, and GDrive
// pouch is currently out
import google from "./google"

const
  UNPERSISTABLE_MUTATIONS = [
    "become",
    "logout",
    "resetState",
    "setShowSpinner",
    "setLoginError",
    "setLoginStatus",
    "appendLoginStatus",
    "setActiveGame",
    "clearActiveGame",
    "setActiveComponent",
    "clearActiveComponent",
    "setActiveLayer",
    "clearActiveLayer"
  ]

let vuex,
  vuexSubscriptionCanceler,
  lastUnsyncedChangeTime,
  lastChangeTime,
  databaseFileId


const
  // get an empty store
  initialize = function(store) {
    vuex = store

    return isSignedIn().then((weAreSignedIn) => {
      if(weAreSignedIn) {
        // Step into our user and start pulling their data
        return Promise.all([
          becomeSignedInUser(),
          syncAll()
        ])
      } else {
        console.log("not signed in. listening for sign-in...")
        syncAllOnLogin()
        return startApplication()
      }
    })
  },

  // Ask Google service if we're currently logged in
  isSignedIn = function() {
    return google.auth.isSignedIn()
  },

  becomeSignedInUser = function() {
    // Already signed in so we immediately get the user object
    return google.auth.getCurrentUser()
      // Pull the goodies out of the user object
      .then(({ email, name, imageUrl }) => {
        // Transform them into what Paperize needs
        return vuex.dispatch("become", {
          idToken:   email,
          name:      name,
          avatarSrc: imageUrl
        })
      })
  },

  // Load Drive to Pouch to Vuex, then...
  // Sync Vuex to Pouch to Drive
  syncAll = function() {
    return initializeDrive()
      .then(loadDriveIntoVuex)
      .then(syncVuexToDrive)
      .then(() => {
        unsyncAllOnLogout()
        return startApplication()
      })
  },

  unsyncAll = function() {
    // Disable active syncing
    vuexSubscriptionCanceler()
    vuexSubscriptionCanceler = null
  },

  // Find or create the Drive database file and resolve its id
  initializeDrive = function() {
    return vuex.dispatch("googleFindOrCreateDatabase")
      .then((fileId) => {
        databaseFileId = fileId
      })
  },

  loadDriveIntoVuex = function() {
    return google.drive.downloadFile(databaseFileId)
      .then((databaseContent) => {
        let loadedState = JSON.parse(databaseContent)
        if(loadedState) {
          // at this point the vuex user is newer data
          loadedState.user = vuex.state.user

          // foist it onto the store
          vuex.commit("resetState", loadedState)
          return null
        }
      })
  },

  syncVuexToDrive = function() {
    if(vuexSubscriptionCanceler) {
      throw new Error("Already subscribed to Vuex mutations!")
    }

    vuexSubscriptionCanceler = vuex.subscribe(({ type }, state) => {
      // early out if this change is unpersistable
      if(UNPERSISTABLE_MUTATIONS.includes(type)) {
        return Promise.resolve(null)
      }

      // TODO: this is junk, need to actually use debounce and such
      let now = Date.now(),
        syncDelta = now - (lastUnsyncedChangeTime || now),
        changeDelta = now - (lastChangeTime || now)

      lastChangeTime = now
      lastUnsyncedChangeTime = lastUnsyncedChangeTime || now

      // throttle and debounce:
      //   > 5s since last sync and > 1s since last change call
      //   sync immediately if over 20s since last sync with any change calls
      if((syncDelta > 5000 && changeDelta > 1000) || syncDelta > 20000) {
        lastUnsyncedChangeTime = null

        // TODO: TRANSFORM HERE
        console.log("writing to Drive...")
        return google.drive.updateFile(databaseFileId, state)
      }
    })
  },

  // Watch Vuex for logins in order to initiate syncing
  syncAllOnLogin = function() {
    let loginSubscriptionCanceler = vuex.subscribe(({ type }) => {
      if(type === "become") {
        // Disable this watcher
        loginSubscriptionCanceler()
        // Fire up and return the syncing Promise cascade
        return syncAll()
      }
    })
  },

  // Watch Vuex for logout in order to disable syncing
  unsyncAllOnLogout = function() {
    let logoutSubscriptionCanceler = vuex.subscribe(({ type }) => {
      if(type === "logout") {
        unsyncAll()
        // Disable this watcher
        logoutSubscriptionCanceler()
      }
    })
  },

  // Tell the Store it's ready to go
  startApplication = function() {
    return vuex.dispatch("setStoreReady")
  }

export default { initialize }
