import { LAYER_DEFAULTS } from './layers'
import { each, isNull, isUndefined, pick, omit } from 'lodash'
import PrintModule from './print'
import { PRINT_ALL_COMPONENTS } from './print'

const PRINT_DEFAULT_STATE = PrintModule.state

const UNPERSISTED_STATE_KEYS = [
  "user",
  "database",
  "cache",
  "ui",
  "uiPrint",
  "google",
  "fonts",
  "errors",
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

    async loadFromDrive({ getters, dispatch, commit  }) {
      const databaseContent = await dispatch("googleDownloadFile", getters.databaseFileId)

      if(!databaseContent) {
        throw new Error(`Failed to load database: ${getters.databaseFileId}`)
      }

      const loadedState = JSON.parse(databaseContent)

      if(!loadedState) {
        throw new Error(`Downloaded database didn't JSON parse: ${databaseContent}`)
      }

      // Migrate the database up to current
      const migratedState = await dispatch("migrate", loadedState)
      // Load the database up!
      return commit("resetState", migratedState)
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
        // No longer using sources, use spreadsheets instead
        delete dbState.sources
      }

      // Sheets -> Spreadsheets
      if(dbState.sheets) {
        if(!dbState.spreadsheets) {
          dbState.spreadsheets = dbState.sheets
          dbState.spreadsheets.spreadsheets = dbState.spreadsheets.sheets
          delete dbState.spreadsheets.sheets
        }
        delete dbState.sheets
      }

      // Remove the old imageFolders image caching concept
      if(dbState.images) {
        // ensure the old imageFolders is gone
        delete dbState.images.imageFolders
        // ensure the new images collection is present
        dbState.images.images = dbState.images.images || {}
      }

      // Games
      if(dbState.games && dbState.games.games) {
        each(dbState.games.games, (game) => {
          // No more sourceId
          if(game.sourceId){
            game.spreadsheetId = game.sourceId
            delete game.sourceId
          }

          // Added printSettings
          if(!game.printSettings) {
            game.printSettings = {
              componentSelection: PRINT_ALL_COMPONENTS,
              componentIdsToPrint: []
            }
          }
        })
      }

      // Components
      if(dbState.components && dbState.components.components) {
        dbState.components.components = each(dbState.components.components, (component) => {
          // No more sourceId
          if(component.sourceId) {
            if(!component.spreadsheetId) {
              component.spreadsheetId = component.sourceId
            }
            delete component.sourceId
          }
          // No more sheetId
          if(component.sheetId) {
            if(!component.spreadsheetId) {
              component.spreadsheetId = component.sheetId
            }
            delete component.sheetId
          }
        })
      }

      return dbState
    }
  }
}

export default DatabaseModule
