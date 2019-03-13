import Vue from 'vue'
import { filter, includes, keys, sortBy, reverse } from 'lodash'
import uuid from 'uuid/v4'
import { auth, sheets, drive } from '../services/google'

const GoogleModule = {
  state: {
    loginStatus: "",
    trackedRequests: {},
    completedRequests: {}
  },

  getters: {
    showSpinner: state => keys(state.trackedRequests).length > 0,
    loginStatus: state => state.loginStatus,
    trackedRequests: state => reverse(sortBy(state.trackedRequests, "timestamp")),
    completedRequests: state => reverse(sortBy(state.completedRequests, "timestamp"))
  },

  mutations: {
    addTrackedRequest(state, { id, name, details="" }) {
      let request = { id, name, details, timestamp: Date.now() }
      Vue.set(state.trackedRequests, id, request)
    },

    errorTrackedRequest(state, { requestId, requestError }) {
      state.trackedRequests[requestId].error = `${requestError.fileName}:${requestError.lineNumber} - ${requestError.message}`
    },

    clearTrackedRequest(state, requestId) {
      Vue.set(state.completedRequests, requestId, state.trackedRequests[requestId])
      Vue.delete(state.trackedRequests, requestId)
    },

    setLoginStatus(state, newStatusMessage) {
      state.loginStatus = `${newStatusMessage}\n`
    },

    appendLoginStatus(state, nextStatusMessage) {
      state.loginStatus += `${nextStatusMessage}\n`
    }
  },

  actions: {
    googleLogin() {
      return auth.signIn()
    },

    googleLogout() {
      return auth.signOut()
    },

    traceNetworkRequest({ commit }, { name, details, promise }) {
      const requestId = uuid()
      commit("addTrackedRequest", { id: requestId, name, details })
      return Promise.resolve(promise)
        .catch((requestError) => {
          // Track that error
          commit("errorTrackedRequest", { requestId, requestError })
          // We don't handle 'em, we just track 'em
          throw requestError
        })
        .finally(() => {
          commit("clearTrackedRequest", requestId)
        })
    },

    googleGetRecord({ dispatch }, fileId) {
      return dispatch("traceNetworkRequest",
        { name: "Get Record.",
          details: fileId,
          promise: drive.getRecord(fileId) })
    },

    googleGetTrackedFileIndex({ dispatch }, folderId) {
      // Get the full index
      return dispatch("googleGetIndex", { folderId })
        .then((files) => {
          return {
            // split the response into the file types we care about
            folders: filter(files, { mimeType: "application/vnd.google-apps.folder" }),
            sheets: filter(files, { mimeType: "application/vnd.google-apps.spreadsheet" }),
            images: filter(files, file => includes(file.mimeType, "image/") ),
          }
        })
    },

    googleGetIndex({ dispatch }, { folderId, options={} }) {
      return dispatch("traceNetworkRequest",
        { name: `Get Index.`,
          details: `Folder: ${folderId}, Options: ${JSON.stringify(options)}`,
          promise: drive.getIndex(folderId, options) })
    },

    googleGetImageFolder({ dispatch }, folderLink) {
      return dispatch("traceNetworkRequest",
        { name: `Get Folder.`,
          details: folderLink,
          promise: drive.getFolder(folderLink) })
    },

    googleCreateFolder({ dispatch }, { parentId, name }) {
      return dispatch("traceNetworkRequest",
        { name: `Create Folder.`,
          details: `Named: "${name}" in folder ${parentId}`,
          promise: drive.createFolder(name, { parentId }) })
    },

    googleCreateSpreadsheet({ dispatch }, { parentId, name }) {
      return dispatch("traceNetworkRequest",
        { name: `Create Spreadsheet.`,
          details: `Named: "${name}" in folder ${parentId}`,
          promise: drive.createSpreadsheet(name, parentId)
        })

        .tap((spreadsheetId) => {
          // Add the Sheet
          return dispatch("createSpreadsheet", {
            id: spreadsheetId,
            name: name,
            parents: [parentId]
          }).then(() => {
            // Index the Sheet
            return dispatch("refreshSheetIndex", spreadsheetId)
          })
        })
    },

    googleAddSheetToSpreadsheet({ dispatch }, { spreadsheetId, sheetName }) {
      return dispatch("traceNetworkRequest",
        { name: `Add Sheet to Spreadsheet.`,
          details: `Named: "${sheetName}"`,
          promise: sheets.addSheetToSpreadsheet(spreadsheetId, sheetName)
        })

        .tap(() => {
          // Refresh our local version of this sheet
          return dispatch("refreshSheetIndex", spreadsheetId)
        })
    },

    googleUpdateFile({ dispatch }, { fileId, contents }) {
      return dispatch("traceNetworkRequest",
        { name: `Update File.`,
          details: fileId,
          promise: drive.updateFile(fileId, contents) })
    },

    googleDownloadFile({ dispatch }, fileId) {
      return dispatch("traceNetworkRequest",
        { name: `Download File.`,
          details: fileId,
          promise: drive.downloadFile(fileId) })
    },

    googleFetchSheetById({ dispatch }, sourceId) {
      return dispatch("traceNetworkRequest",
        { name: `Fetch Sheet.`,
          details: sourceId,
          promise: sheets.fetchSheetById(sourceId) })
    },
  }
}

export default GoogleModule
