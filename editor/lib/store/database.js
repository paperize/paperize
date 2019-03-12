import { LAYER_DEFAULTS } from './layers'
import { each, isNull, isUndefined, pick, omit, take } from 'lodash'
import PrintModule from './print'

const PRINT_DEFAULT_STATE = PrintModule.state

const UNPERSISTED_STATE_KEYS = [
  "user",
  "database",
  "cache",
  "ui",
  "uiPrint",
  "google"
]

const DatabaseModule = {
  state: {
    workingDirectory: {
      id: null,
      name: null
    },
    databaseFile: {
      id: null,
      name: null
    },
  },

  getters: {
    workingDirectory: (state, getters) => { return { ...state.workingDirectory, url: getters.workingDirectoryUrl } },
    workingDirectoryId: state => state.workingDirectory.id,
    workingDirectoryName: state => state.workingDirectory.name,
    workingDirectoryUrl: (state, getters) => getters.driveUrl(state.workingDirectory.id),
    databaseFile: (state, getters) => { return { ...state.databaseFile, url: getters.databaseFileUrl } },
    databaseFileId: state => state.databaseFile.id,
    databaseFileName: state => state.databaseFile.name,
    databaseFileUrl: (state, getters) => getters.driveUrl(state.databaseFile.id),
    driveUrl: () => driveId => `https://drive.google.com/file/d/${driveId}/edit?usp=sharing`,

    databaseState: (_, __, rootState) => {
      return omit(rootState, UNPERSISTED_STATE_KEYS)
    },

    nonPersistedState: (_, __, rootState) => {
      return pick(rootState, UNPERSISTED_STATE_KEYS)
    }
  },

  mutations: {
    setWorkingDirectory(state, { id, name }) {
      state.workingDirectory.id = id
      state.workingDirectory.name = name
    },

    setDatabaseFile(state, { id, name }) {
      state.databaseFile.id = id
      state.databaseFile.name = name
    },
  },

  actions: {
    saveToDrive({ dispatch, getters }) {
      return dispatch("googleUpdateFile", {
        fileId: getters.databaseFileId,
        contents: getters.databaseState
      })
    },

    prepareRootItems({ commit }, { workingDirectory, databaseFile }) {
      commit("setWorkingDirectory", workingDirectory)
      commit("setDatabaseFile", databaseFile)
    },

    loadFromDrive({ getters, dispatch, commit  }) {
      return dispatch("googleDownloadFile", getters.databaseFileId)
        .then((databaseContent) => {
          if(!databaseContent) {
            throw new Error(`Failed to load database: ${getters.databaseFileId}`)
          }

          let loadedState = JSON.parse(databaseContent)

          if(!loadedState) {
            throw new Error(`Downloaded database didn't JSON parse: ${databaseContent}`)
          } else {
            // Migrate the database up to current
            return dispatch("migrate", loadedState)
              .then((migratedState) => {
                // Load the database up!
                commit("resetState", migratedState)

                return dispatch("ensureWorkingFolder")
              })
          }
        })
    },

    migrate({ getters }, dbState) {
      // combine the loaded data with the local stuff that doesn't get persisted
      const { user, database, google } = getters.nonPersistedState
      dbState.user = user
      dbState.database = database
      dbState.google = google

      // Add missing data to layers if present
      if(dbState.layers && dbState.layers.layers) {
        each(dbState.layers.layers, (layer) => {
          each(LAYER_DEFAULTS[layer.type], (value, key) => {
            if(isNull(layer[key]) || isUndefined(layer[key])) {
              // Default each property as needed
              layer[key] = layer[key] || value
            }
          })
        })
      }

      // 5.3 -> 5.4
      // Print settings
      if(dbState.print) {
        each(PRINT_DEFAULT_STATE, (value, key) => {
          dbState.print[key] = dbState.print[key]  || value
        })
        if(dbState.print.width) { delete dbState.print.width }
        if(dbState.print.height) { delete dbState.print.height }
      }

      // 5.4 -> 5.5
      // Components
      if(dbState.components && dbState.components.components) {
        each(dbState.components.components, (component) => {
          // Doesn't need the folderId property
          delete component.folderId
          // Needs worksheetId property
          component.worksheetId = component.worksheetId || null
        })
      }

      // Sources
      if(dbState.sources) {
        // No longer tracking remote sources ourselves
        if(dbState.sources.remoteSources) {
          delete dbState.sources.remoteSources
        }

        // Move to a multiple-worksheet world
        if(dbState.sources.sources) {
          each(dbState.sources.sources, (source) => {
            // old data location
            if(source.data) {
              // construct a good worksheet id from the range's A1 format
              let rangeChunks = source.data.range.split('!')
              rangeChunks = take(rangeChunks, rangeChunks.length - 1)
              const worksheetId = rangeChunks.join('!')

              // make sure worksheets collection exists
              source.worksheets = source.worksheets || []
              // put this new worksheet in front so it is default
              source.worksheets.unshift({
                id: worksheetId,
                values: source.data.values
              })

              delete source.data
            }
          })
        }
      }

      if(dbState.images) {
        // ensure the old imageFolders is gone
        delete dbState.images.imageFolders
        // ensure the new images collection is present
        dbState.images.images = dbState.images.images || {}
      }

      return dbState
    }
  }
}

export default DatabaseModule
