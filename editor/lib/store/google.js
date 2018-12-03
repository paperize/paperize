import { keys } from 'lodash'
import uuid from 'uuid/v4'
import { auth, sheets, drive } from '../services/google'

const GoogleModule = {
  state: {
    loginStatus: "",
    trackedRequests: {}
  },

  getters: {
    showSpinner: state => keys(state.trackedRequests).length > 0,
    loginStatus: state => state.loginStatus
  },

  mutations: {
    addTrackedRequest(state, { id, name }) {
      state.trackedRequests[id] = name
    },

    clearTrackedRequest(state, requestId) {
      delete state.trackedRequests[requestId]
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

    traceNetworkRequest({ commit }, { name, promise }) {
      const requestId = uuid()
      commit("addTrackedRequest", { id: requestId, name })
      return promise.finally(() => {
        commit("clearTrackedRequest", { id: requestId })
      })
    },

    googleGetRecord({ dispatch }, fileId) {
      return dispatch("traceNetworkRequest",
        { name: `Get Record. ${fileId}`,
          promise: drive.getRecord(fileId) })
    },

    googleGetIndex({ dispatch }, { folderId, options }) {
      return dispatch("traceNetworkRequest",
        { name: `Get Index. ${folderId}, ${options}`,
          promise: drive.getIndex(folderId, options) })
    },

    googleGetImageFolder({ dispatch }, folderLink) {
      return dispatch("traceNetworkRequest",
        { name: `Get Folder. ${folderLink}`,
          promise: drive.getFolder(folderLink) })
    },

    googleUpdateFile({ dispatch }, { fileId, contents }) {
      return dispatch("traceNetworkRequest",
        { name: `Update File. ${fileId}`,
          promise: drive.updateFile(fileId, contents) })
    },

    googleDownloadFile({ dispatch }, fileId) {
      return dispatch("traceNetworkRequest",
        { name: `Download File. ${fileId}`,
          promise: drive.downloadFile(fileId) })
    },

    googleFetchSheets({ dispatch }) {
      return dispatch("traceNetworkRequest",
        { name: `Fetch Sheets.`,
          promise: sheets.fetchSheets() })
    },

    googleFetchSheetById({ dispatch }, sourceId) {
      return dispatch("traceNetworkRequest",
        { name: `Fetch Sheet. ${sourceId}`,
          promise: sheets.fetchSheetById(sourceId) })
    },
  }
}

export default GoogleModule
