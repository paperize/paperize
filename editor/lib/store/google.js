import Vue from 'vue'
import { filter, flatten, includes, keys, map, sortBy, reverse } from 'lodash'
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
      const
        indexRequestPromises = map(folderIds, (folderId) => drive.getIndex(folderId))

      return Promise.all(indexRequestPromises)
        .then((requestPromises) => {
          const indexRequests = map(requestPromises, "request")
          return dispatch("googleBatchRequests", indexRequests)
            .then(() => {
              return Promise.all(indexRequests)
            })
        })
        .then((responses) => {
          // each response in the batch
          return flatten(map(responses, ({ result: { files } }) => {
            // transform from Google response to Paperize data
            return map(files, (file) => {
              return {
                id:       file.id,
                name:     file.name,
                md5:      file.md5Checksum,
                mimeType: file.mimeType,
                parents:  file.parents
              }
            })
          }))
        })

        .then((files) => {
          return {
            // split the response into the file types we care about
            folders: filter(files, { mimeType: "application/vnd.google-apps.folder" }),
            sheets: filter(files, { mimeType: "application/vnd.google-apps.spreadsheet" }),
            images: filter(files, file => includes(file.mimeType, "image/") ),
          }
        })

        .tap(() => {
          return dispatch("touchFolders", folderIds)
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
