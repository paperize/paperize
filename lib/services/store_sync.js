// Store Sync
// Synchronize data between Vuex, ~~Pouch~~, and GDrive
// pouch is currently out
import { debounce } from 'lodash'
import google from "./google"
import router from '../routes'

const
  FOLDER_NAME = "Paperize.io",
  DATABASE_NAME = "paperize_database.json",
  DATABASE_MIME = "application/json",
  EMPTY_DATABASE = "{}",
  AUTOSAVE_MIN_WAIT = 3000,
  AUTOSAVE_MAX_WAIT = 20000,
  UNPERSISTABLE_MUTATIONS = [
    "become",
    "logout",
    "resetState",
    "setLoginError",
    "setLoginStatus",
    "appendLoginStatus",
    "addTrackedRequest",
    "clearTrackedRequest",
    "setActiveGame",
    "clearActiveGame",
    "setActiveComponent",
    "clearActiveComponent",
    "setActiveLayer",
    "clearActiveLayer",
    "setActiveItem",
    "setLayerHighlighting",
    "setPrintJobStatus",
    "setStatusWindowOpen",
    "createError",
    "incrementUnreadErrorCount",
    "setUnreadErrorCount",
    "clearUnreadErrorCount",
    "setStatusWindowOpen",
    "setGoogleFonts",
    "setRequestPromise",
  ]

let vuex,
  vuexSubscriptionCanceler,
  databaseFileId,
  workingDirectoryId


const
  // get an empty store
  initialize = function(store) {
    vuex = store

    registerSignInListener()

    return isSignedIn()
      .then((weAreSignedIn) => {
        if(weAreSignedIn) {
          return signInStatusChange(true)
        } else {
          return startApplication()
        }
      })
  },

  registerSignInListener = function () {
    google.auth.registerSignInListener(signInStatusChange)
  },

  signInStatusChange = function(signedIn) {
    if(signedIn) {
      return Promise.all([
        // become the user
        becomeSignedInUser(),
        // strategy for database selection
        syncAll()
      ])
    } else {
      // wipe vuex
      vuex.commit("resetState")
      unsyncAll()
      router.push({ name: "threshold" })
    }
  },

  // Ask Google service if we're currently logged in
  isSignedIn = function() {
    return google.auth.isSignedIn()
  },

  becomeSignedInUser = function() {
    // Already signed in so we immediately get the user object
    return google.auth.getCurrentUserProfile()
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
    return google.drive.findFolders(FOLDER_NAME)
      .then((maybeFolderIds) => {
        if(maybeFolderIds.length == 0) {
          // None found? Create one and wrap in array
          return google.drive.createFolder(FOLDER_NAME).then(folderId => [folderId])
        } else {
          return maybeFolderIds
        }
      })

      // Guaranteed to be at least length 1
      .then((folderIds) => {
        // Find a database file in any of the folders
        return google.drive.findFile(DATABASE_NAME, DATABASE_MIME, folderIds)
          .spread((maybeDatabaseId, maybeParentId) => {
            if(!maybeDatabaseId) {
              // Didn't find one? Create an empty one in the first folder.
              let firstFolderId = folderIds[0]
              return google.drive.createFile(DATABASE_NAME, DATABASE_MIME, firstFolderId, EMPTY_DATABASE)
                .then((createdDatabaseId) => {
                  databaseFileId = createdDatabaseId
                  workingDirectoryId = firstFolderId
                })
            } else {
              databaseFileId = maybeDatabaseId
              workingDirectoryId = maybeParentId
            }
          })
      })

      .then(() => {
        return vuex.dispatch("prepareRootItems", {
          workingDirectory: { id: workingDirectoryId, name: FOLDER_NAME },
          databaseFile: { id: databaseFileId, name: DATABASE_NAME }
        })
      })
  },

  loadDriveIntoVuex = function() {
    return vuex.dispatch("loadFromDrive")
  },

  autoSave = debounce(function() {
    vuex.dispatch("saveToDrive")
  }, AUTOSAVE_MIN_WAIT, { maxWait: AUTOSAVE_MAX_WAIT }),

  syncVuexToDrive = function() {
    if(vuexSubscriptionCanceler) {
      throw new Error("Already subscribed to Vuex mutations!")
    }

    // Subscribe to all store updates
    vuexSubscriptionCanceler = vuex.subscribe(({ type }) => {
      // Ignore as many updates as possible
      if(!UNPERSISTABLE_MUTATIONS.includes(type)) {
        // Call autosave otherwise
        autoSave()
      }
    })
  },

  // Tell the Store it's ready to go
  startApplication = function() {
    return vuex.dispatch("setStoreReady")
  },


  /* All Pseudocode from here down */
  loginRouting = () => {
    if(!complexUrl()) { goHome() }

    return checkLoginStatus()
      .then((loggedIn) => {
        if(!loggedIn && complexUrl()) { // Ok to lose the complex URL now
          goHome()
        }

        if(loggedIn) {
          renderUserPanel()
          return checkForDatabase()
        }
      })
  },

  complexUrl = () => { },
  goHome = () => { },
  renderUserPanel = () => { },
  checkLoginStatus = () => { },

  checkForDatabase = () => {
    return Promise.map([
      loadLocalDB(),
      loadRemoteDB(),
    ])
    // user panel has database creation options if neither loaded
  },

  loadLocalDB = () => {
    return lookupLocalDB().then((localDB) => {
      if(!localDB) { return Promise.reject() }

      return loadDB(localDB)
    })
  },

  loadRemoteDB = () => {
    return lookupRemoteDB().then((remoteDB) => {
      const loadedDBInfo = checkDBInfo()
      if(!remoteDB) {
        return loadedDBInfo ?
          promptUserToCreateRemote() :
          Promise.reject()
      }

      // no database here, go ahead and load up the remote
      if(!loadedDBInfo) { return loadDB(remoteDB) }

      // Remote is newer than Local, let user decide which to use
      if(dbTimeStamp(remoteDB) > dbTimeStamp(loadedDBInfo)) {
        return promptUserToChoose().then((choseRemote) => {
          return choseRemote ?
            loadDB(remoteDB) :
            giveUserGreenCheck()
        })
      }

      return giveUserGreenCheck()
    })
  },

  storeDBInfo = () => {},
  checkDBInfo = () => {},
  lookupLocalDB = () => {},
  lookupRemoteDB = () => {},
  promptUserToCreateRemote = () => {},
  promptUserToChoose = () => {},
  dbTimeStamp = () => {},
  giveUserGreenCheck = () => {},

  loadDB = (database) => {
    storeDBInfo(database) // timestamp, hash, version?
    database = migrateDB(database)
    return vuexLoadDB( database )
  },

  migrateDB = () => { },
  vuexLoadDB = () => { }


export default { initialize }
