// Store Sync
// Synchronize data between Vuex, ~~Pouch~~, and GDrive
// pouch is currently out
import Promise from "bluebird"
// import MemoryStream from 'memorystream'
import google from "./google"
import PouchDB from "./pouch"

const
  DATABASE_NAME = "Paperize",
  STATE_KEY = "paperize_databasez",
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
  pouch,
  pouchSubscription,
  lastSave,
  lastUnsyncedChangeTime,
  lastChangeTime,
  databaseFileId


const
  // get an empty store
  initialize = function(store) {
    vuex = store
    pouch = new PouchDB(DATABASE_NAME)

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

      // .then(loadDriveIntoPouch)
      // .then(loadPouchIntoVuex)
      // .then(syncVuexToPouch)
      // .then(syncPouchToDrive)

      .then(() => {
        unsyncAllOnLogout()
        return startApplication()
      })
  },

  unsyncAll = function() {
    // Disable active syncing
    vuexSubscriptionCanceler()
    vuexSubscriptionCanceler = null
    // pouchSubscription.cancel()
    // pouchSubscription = null
  },

  // Find or create the Drive database file and resolve its id
  initializeDrive = function() {
    return vuex.dispatch("googleFindOrCreateDatabase")
      .then((fileId) => {
        databaseFileId = fileId
        console.log("done driving", databaseFileId)
      })
  },

  loadDriveIntoVuex = function() {
    return google.drive.downloadFile(databaseFileId)
      .then((databaseContent) => {
        let loadedState = JSON.parse(databaseContent)
        if(loadedState) {
          console.log(loadedState)
          // at this point the vuex user is newer data
          loadedState.user = vuex.state.user

          // foist it onto the store
          console.log("loading state:", loadedState)
          vuex.commit("resetState", loadedState)
          return null
        }
      })
  },

  // Load the Drive database into the Pouch database
  loadDriveIntoPouch = function() {
    return google.drive.downloadFile(databaseFileId)
      .then((databaseContent) => {
        console.log("downloaded:", databaseContent)
        // do the MemoryStream dance to
        // let databaseStream = new MemoryStream(databaseContent)
        let databaseStream = new MemoryStream(`
          {"version":"0.1.0","db_type":"leveldb","start_time":"2014-09-07T21:31:01.527Z","db_info":{"doc_count":3,"update_seq":3,"db_name":"testdb"}}
          {"docs":[{"_id":"doc1","_rev":"1-x","_revisions":{"start":1,"ids":["x"]},"foo":"bar"}]}
          {"docs":[{"_id":"doc2","_rev":"1-y","_revisions":{"start":1,"ids":["y"]},"foo":"baz"}]}
          {"docs":[{"_id":"doc3","_rev":"1-z","_revisions":{"start":1,"ids":["z"]},"foo":"quux"}]}
          {"seq":3}
        `, { writeable: false })
        // debugger
        // load this JSON string into PouchDB
        return pouch.load(databaseStream)
          .then(() => { console.log("loadedthen")})
          .catch((err) => { console.log("loadedcatch", err)})
          .finally(() => { console.log("loaded") })
      })
  },

  // Load the Pouch database into Vuex
  loadPouchIntoVuex = function() {
    return new Promise((resolve) => {
      return pouch.get(STATE_KEY)
        .then((record) => {
          // set up the saving mechanism
          lastSave = Promise.resolve(record._rev)
          // Clean the Pouch stuff off the data
          delete record._id
          delete record._rev

          resolve(record)
        })
        // TODO: is the below needed?
        // .catch(reject) // lets us use the Bluebird catcher
    })
      .catch({status: 404}, () => {
        return null
      })

      .then((loadedState) => {
        if(loadedState) {
          // the given user might have new stuff
          loadedState.user.name      = vuex.state.user.name      || loadedState.user.name
          loadedState.user.avatarSrc = vuex.state.user.avatarSrc || loadedState.user.avatarSrc
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
      console.log("mutation:", type)
      // early out if this change is unpersistable
      if(UNPERSISTABLE_MUTATIONS.includes(type)) {
        return Promise.resolve(null)
      }
      console.log("persistable")
      let now = Date.now(),
        syncDelta = now - (lastUnsyncedChangeTime || now),
        changeDelta = now - (lastChangeTime || now)

      lastChangeTime = now
      lastUnsyncedChangeTime = lastUnsyncedChangeTime || now

      console.log(syncDelta, changeDelta, lastChangeTime, lastUnsyncedChangeTime)
      // throttle and debounce:
      //   > 5s since last sync and > 1s since last change call
      //   sync immediately if over 20s since last sync with any change calls
      if((syncDelta > 5000 && changeDelta > 1000) || syncDelta > 20000) {
        console.log("synchrable")
        lastUnsyncedChangeTime = null

        // TODO: TRANSFORM HERE
        console.log("writing to Drive...")
        return google.drive.updateFile(databaseFileId, state)
      }
    })
  },

  // Watch Vuex for updates to write to Pouch
  syncVuexToPouch = function() {
    if(vuexSubscriptionCanceler) {
      throw new Error("Already subscribed to Vuex mutations!")
    }

    vuexSubscriptionCanceler = vuex.subscribe(({ type }, state) => {
      // early out if this change is unpersistable
      if(UNPERSISTABLE_MUTATIONS.includes(type)) {
        return Promise.resolve(null)
      }

      // TODO: a transform on the state between Vuex and Pouch
      // - remove the ui state
      // - make user/auth modifications/removals as needed

      // A nice trick to manage Pouch revisions with Promise resolutions
      lastSave = lastSave.then((lastRev) => {
        // Add the Pouch fluff to the state
        let record = { _id: STATE_KEY, _rev: lastRev, ...state }

        return new Promise((resolve) => {
          return pouch.put(record)
            .then((response) => {
              resolve(response.rev)
            })

        // TODO: why no Pouch Promise wrapper for the awesome catch below?
        }).catch({ status: 409 }, (conflictError) => {
          console.error("PouchDB conflict saving record:", record)
          throw conflictError
        })
      })
    })
  },

  // Watch Pouch for updates to write to Drive
  syncPouchToDrive = function() {
    if(pouchSubscription) {
      throw new Error("Already subscribed to Pouch changes!")
    }

    pouchSubscription = pouch.changes({
      since: 'now',
      live: true
    }).on('change', () => {
      let now = Date.now(),
        syncDelta = now - (lastUnsyncedChangeTime || now),
        changeDelta = now - (lastChangeTime || now),
        lastChangeTime = now,
        lastUnsyncedChangeTime = lastUnsyncedChangeTime || now

      // throttle and debounce:
      //   > 5s since last sync and > 1s since last change call
      //   sync immediately if over 20s since last sync with any change calls
      if((syncDelta > 5000 && changeDelta > 1000) || syncDelta > 20000) {
        lastUnsyncedChangeTime = null
        // sync now
        pouch.get(STATE_KEY)
          .then((record) => {
            return google.drive.updateFile(databaseFileId, record)
          })
      }

    }).on('error', (err) => {
      console.error("Error in Pouch -> Drive sync!")
      throw err
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
