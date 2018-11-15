import { auth, sheets, drive } from '../services/google'

const FOLDER_NAME = "Paperize.io",
  DATABASE_NAME = "paperize_database.json",
  DATABASE_MIME = "application/json",
  EMPTY_DATABASE = "{}"

const GoogleModule = {
  state: {
    showSpinner: false
  },

  getters: {
    showSpinner: state => state.showSpinner
  },

  mutations: {
    setShowSpinner(state, showOrNot) {
      state.showSpinner = showOrNot
    }
  },

  actions: {
    googleLogin() {
      return auth.signIn()
    },

    googleLogout() {
      return auth.signOut()
    },

    googleFetchSheets({ commit }) {
      commit("setShowSpinner", true)
      return sheets
        .fetchSheets()
        .finally(() => commit("setShowSpinner", false))
    },

    googleFetchSheetById({ commit }, sourceId) {
      commit("setShowSpinner", true)
      return sheets
        .fetchSheetById(sourceId)
        .finally(() => commit("setShowSpinner", false))
    },

    // Returns the ID of a database file in Drive, possibly creating the file
    // and folder along the way.
    googleFindOrCreateDatabase() {
      // find a Paperize folder
      return drive.findFolders(FOLDER_NAME)
        .then((maybeFolderIds) => {
          if(maybeFolderIds.length == 0) {
            // None found? Create one and wrap in array
            return drive.createFolder(FOLDER_NAME).then(folderId => [folderId])
          } else {
            return maybeFolderIds
          }
        })

        // Guaranteed to be at least length 1
        .then((folderIds) => {
          // Find a database file in any of the folders
          return drive.findFile(DATABASE_NAME, DATABASE_MIME, folderIds)
            .then((maybeDatabaseId) => {
              if(!maybeDatabaseId) {
                // Didn't find one? Create an empty one in the first folder.
                return drive.createFile(DATABASE_NAME, DATABASE_MIME, folderIds[0], EMPTY_DATABASE)
              } else {
                return maybeDatabaseId
              }
            })
        })
    }
  }
}

export default GoogleModule
