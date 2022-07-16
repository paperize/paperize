import Vue from 'vue'
import { keys, sortBy, reverse } from 'lodash'
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

    googleRevokeAccess() {
      return auth.revokeAccess()
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

    googleBatchRequests({ dispatch }, requests) {
      return dispatch("traceNetworkRequest",
        { name: "Get Batch",
          details: `Batching ${requests.length} requests`,
          promise: drive.doBatchRequest(requests) })
    },

    googleGetRecord({ dispatch }, fileId) {
      return dispatch("traceNetworkRequest",
        { name: "Get Record.",
          details: fileId,
          promise: drive.getRecord(fileId) })
    },

    googleBatchGetTrackedFileIndex({ dispatch }, folderIds) {
      return dispatch("traceNetworkRequest",
        { name: `Index Folders.`,
          details: `Indexing ${folderIds.length} Folders.`,
          promise: drive.getIndex(folderIds).then(index => {
            return dispatch("touchFolders", folderIds)
              .then(() => index)
          })
        })
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

        .then(spreadsheetId => {
          // Add the Sheet
          return dispatch("createSpreadsheet", {
            id: spreadsheetId,
            name: name,
            parents: [parentId]
          }).then(() => {
            // Index the Sheet
            return dispatch("refreshSheetIndex", spreadsheetId)
          }).then(() => spreadsheetId)
        })
    },

    googleAddSheetToSpreadsheet({ dispatch }, { spreadsheetId, sheetName }) {
      return dispatch("traceNetworkRequest",
        { name: `Add Sheet to Spreadsheet.`,
          details: `Named: "${sheetName}"`,
          promise: sheets.addSheetToSpreadsheet(spreadsheetId, sheetName)
        })

        .then(trace => {
          // Refresh our local version of this sheet
          return dispatch("refreshSheetIndex", spreadsheetId)
            .then(() => trace)
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
