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

  // Load Drive to Pouch to Vuex, then...
  // Sync Vuex to Pouch to Drive
  syncAll = async () => {
    await initializeDrive()
    await loadDriveIntoVuex()
    await syncVuexToDrive()
    return startApplication()
  },

  // Disable active syncing
  unsyncAll = () => {
    vuexSubscriptionCanceler()
    vuexSubscriptionCanceler = null
  },

  // Find or create the Drive database file and resolve its id
  initializeDrive = async () => {
    const
      { createFile, createFolder, findFile, findFolders} = google.drive,
      // Find or Create Drive Folder by Name
      folderIds = (await findFolders(FOLDER_NAME)) || [await createFolder(FOLDER_NAME)],
      // Find a database file in any of the folders
      [ maybeDatabaseId, maybeParentId ] = await findFile(DATABASE_NAME, DATABASE_MIME, folderIds)

    if(!maybeDatabaseId) {
      // Didn't find one? Create an empty one in the first folder.
      workingDirectoryId = folderIds[0],
      databaseFileId = await createFile(DATABASE_NAME, DATABASE_MIME, workingDirectoryId, EMPTY_DATABASE)
    } else {
      databaseFileId = maybeDatabaseId
      workingDirectoryId = maybeParentId
    }

    return vuex.dispatch("prepareRootItems", {
      workingDirectory: { id: workingDirectoryId, name: FOLDER_NAME },
      databaseFile: { id: databaseFileId, name: DATABASE_NAME }
    })
  },

  loadDriveIntoVuex = () =>vuex.dispatch("loadFromDrive"),

  autoSave = debounce(() => vuex.dispatch("saveToDrive"), AUTOSAVE_MIN_WAIT, { maxWait: AUTOSAVE_MAX_WAIT }),

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
