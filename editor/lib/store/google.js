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
      // we track folders, sheets, and images
      return Promise.props({
        folders: dispatch("googleGetIndex", { folderId, options: { indexType: 'FOLDER' }}),
        sheets: dispatch("googleGetIndex", { folderId, options: { indexType: 'SHEET' }}),
        images: dispatch("googleGetIndex", { folderId, options: { indexType: 'IMAGE' }}),
      })
    },

    googleGetIndex({ dispatch }, { folderId, options={} }) {
      return dispatch("traceNetworkRequest",
        { name: `Get ${options.indexType} Index.`,
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
          // Create our local version of this sheet
          return dispatch("downloadAndSaveSource", spreadsheetId)
        })
    },

    googleAddSheetToSpreadsheet({ dispatch }, { spreadsheetId, sheetName }) {
      return dispatch("traceNetworkRequest",
        { name: `Add Sheet to Spreadsheet.`,
          details: `Named: "${sheetName}"`,
          promise: sheets.addSheetToSpreadsheet(spreadsheetId, sheetName)
        })

        .then(() => {
          // Refresh our local version of this sheet
          return dispatch("downloadAndSaveSource", spreadsheetId)
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
