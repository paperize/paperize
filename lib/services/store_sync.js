// Store Sync
// Synchronize data between Vuex and Google Drive
import { debounce } from 'lodash'
import { diff } from 'deep-object-diff'
import google from "./google"
import router from '../routes'
import { getCachedDB, setCachedDB } from './database_cache'
import { MD5 } from 'object-hash'


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
    "setExportStartedAt",
    "setExportGameStatus",
    "setExportItemStatus",
    "setStatusWindowOpen",
    "createError",
    "incrementUnreadErrorCount",
    "setUnreadErrorCount",
    "clearUnreadErrorCount",
    "setGoogleFonts",
    "setRequestPromise",
  ]

let
  vuex,
  vuexSubscriptionCanceler,
  databaseFileId,
  workingDirectoryId

const
  // get an empty store
  initialize = async store => {
    vuex = store

    registerSignInListener()

    return await isSignedIn()
      ? signInStatusChange(true)
      : startApplication()
  },

  registerSignInListener = () => {
    google.auth.registerSignInListener(signInStatusChange)
  },

  signInStatusChange = signedIn => {
    if(signedIn) {
      return Promise.all([
        becomeSignedInUser(),
        syncAll()
      ])
    }

    // wipe vuex
    vuex.commit("resetState")
    unsyncAll()
    router.push({ name: "splash" })
  },

  // Ask Google service if we're currently logged in
  isSignedIn = () => google.auth.isSignedIn(),

  // Already signed in so we immediately get the user object
  becomeSignedInUser = async () => {
    const
      // Get what we need out of the Google user object
      { email, name, imageUrl } = await google.auth.getCurrentUserProfile(),
      // Transform them into a Paperize user object
      userRecord = {
        idToken:   email,
        name:      name,
        avatarSrc: imageUrl
      }

    // shove them into the store
    return vuex.dispatch("become", userRecord)
  },

  // Quickload Local Cache, Prepare Drive, Hydrate Vuex, Autosave on Change
  syncAll = async () => {
    // Load the locally cached database file
    const
      db = await getCachedDB(),
      cacheMD5 = MD5(db)

    if(db) {
      const migratedDB = await vuex.dispatch("migrate", { ...db })
      vuex.commit("resetState", migratedDB)
      await startApplication()
    }

    // Make sure Paperize.io Folders and paperize_database.json files exist in Drive
    await initializeDrive()

    // Download the database file
    const databaseContent = await vuex.dispatch("googleDownloadFile", vuex.getters.databaseFileId)
    if(!databaseContent) {
      throw new Error(`Failed to load database: ${vuex.getters.databaseFileId}`)
    }

    // Parse and fingerprint the database file
    const
      loadedState = JSON.parse(databaseContent),
      downloadedMD5 = MD5(loadedState)

    if(!loadedState) {
      throw new Error(`Downloaded database didn't JSON parse: ${databaseContent}`)
    }

    // Compare the fingerprints of the cache and remote database, update when they don't match
    if(cacheMD5 !== downloadedMD5) {
      cacheMD5 && console.warn("Database from Google Drive didn't match the local cache:", diff(db, loadedState))
      await setCachedDB(loadedState)
      const migratedState = await vuex.dispatch("migrate", loadedState)
      vuex.commit("resetState", migratedState)
      await startApplication()
    }

    return syncVuexToDrive()
  },

  // Disable active syncing
  unsyncAll = () => {
    vuexSubscriptionCanceler()
    vuexSubscriptionCanceler = null
  },

  // Find or create the Drive database file and resolve its id
  initializeDrive = async () => {
    const
      gd = google.drive,
      // Find or Create Drive Folder by Name
      maybeFolderIds = await gd.findFolders(FOLDER_NAME),
      folderIds = (maybeFolderIds.length > 0)
        ? maybeFolderIds
        : [ await gd.createFolder(FOLDER_NAME) ],
      // Find a database file in any of the folders
      [ maybeDatabaseId, maybeParentId ] = await gd.findFile(DATABASE_NAME, DATABASE_MIME, folderIds)

    if(!maybeDatabaseId) {
      // Didn't find one? Create an empty one in the first folder.
      workingDirectoryId = folderIds[0],
      databaseFileId = await gd.createFile(DATABASE_NAME, DATABASE_MIME, workingDirectoryId, EMPTY_DATABASE)
    } else {
      workingDirectoryId = maybeParentId
      databaseFileId = maybeDatabaseId
    }

    return vuex.dispatch("prepareRootItems", {
      workingDirectory: { id: workingDirectoryId, name: FOLDER_NAME },
      databaseFile: { id: databaseFileId, name: DATABASE_NAME }
    })
  },

  autoSave = debounce(async () => {
    console.log('going to drive')
    await vuex.dispatch("saveToDrive")
    await setCachedDB(vuex.getters.databaseState)
  }, AUTOSAVE_MIN_WAIT, { maxWait: AUTOSAVE_MAX_WAIT }),

  syncVuexToDrive = () => {
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
  startApplication = () => vuex.dispatch("setStoreReady")

export default { initialize }
