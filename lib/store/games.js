import uuid from 'uuid/v4'
import { find, filter, includes } from 'lodash'
import { generateCrud } from './util/vuex_resource'
import { PRINT_SELECT_COMPONENTS, PRINT_ALL_COMPONENTS } from './print'

const GameModel = {
  name: 'games',

  relationships: [
    { relation: 'hasMany', model: 'component', dependent: true }
  ],

  create(newGame={}) {
    return {
      // Defaults
      id:            uuid(),
      title:         "",
      folderId:      null,
      description:   "",
      coverArt:      "",
      playerCount:   "",
      playTime:      "",
      ageRange:      "",
      spreadsheetId: null,
      printSettings: {
        componentSelection: PRINT_ALL_COMPONENTS,
        componentIdsToPrint: []
      },
      componentIds:  [ ],
      // Override with given
      ...newGame
    }
  },

  getters: {
    findAllGameComponents: (_, __, ___, rootGetters) => game => {
      return rootGetters.findAllComponents(game.componentIds)
    },

    findAllPrintableGameComponents: (_, getters, __, rootGetters) => game => {
      // A printable component must:
      return filter(getters.findAllGameComponents(game), (component) => {
        // ...be included by this game's print settings
        const { componentSelection, componentIdsToPrint } = game.printSettings
        if (componentSelection === PRINT_SELECT_COMPONENTS && !includes(componentIdsToPrint, component.id)) {
          return false
        }
        // ...have at least one item
        const itemQuantity = rootGetters.getComponentItems(component).length
        if(!itemQuantity > 0) { return false }

        // ...have a template with at least one layer
        const template = component.templateId && rootGetters.findTemplate(component.templateId)
        if(!template || !template.layerIds.length > 0) { return false }

        return true
      })
    },

    findGameByComponentId: (state) => componentId => {
      return find(state.games, (game) => {
        return includes(game.componentIds, componentId)
      })
    },

    getGameFolderId: (_, __, ___, rootGetters) => game => {
      return game.folderId || rootGetters.workingDirectoryId
    },

    gameFolder: (_, __, ___, rootGetters) => game => {
      return game.folderId && rootGetters.findFolder(game.folderId)
    },

    gameFolderOrDefault: (_, getters, __, rootGetters) => game => {
      return getters.gameFolder(game) || rootGetters.findFolder(rootGetters.workingDirectoryId)
    },

    gameImagesFolder: (_, __, ___, rootGetters) => game => {
      return game.folderId &&
        rootGetters.searchFolders((folder) => {
          // Find a subfolder named "Images" with the folderId in parents
          return folder.name == "Images" && includes(folder.parents, game.folderId)
        })[0] // return first one found
    },

    gameImagesFolderOrDefault: (_, getters) => game => {
      return getters.gameImagesFolder(game) || getters.gameFolderOrDefault(game)
    },

    gameSpreadsheet: (_, __, ___, rootGetters) => game => {
      return game.spreadsheetId && rootGetters.findSpreadsheet(game.spreadsheetId)
    }
  },

  mutations: {
    pushGameComponentId(state, { game, componentId }) {
      game.componentIds.push(componentId)
    },

    spliceGameComponentId(state, { game, componentId }) {
      // remove the component in question
      game.componentIds.splice(game.componentIds.indexOf(componentId), 1)
    }
  },

  actions: {
    createDriveArtifactsForGame({ dispatch }, game) {
      // Create this Game's Folder in Google Drive
      return dispatch("createFolderArtifactForGame", game)
        .then((folderId) => Promise.all([
          // Create Sheet for this game in Google Drive
          dispatch("createSheetArtifactForGame", { ...game, folderId }),
          // Create the Images Folder in Google Drive
          dispatch("createImagesFolderArtifactForGame", { ...game, folderId })
        ]))
    },

    createFolderArtifactForGame({ dispatch, getters }, game) {
      const workingDirectoryId = getters.workingDirectoryId

      return dispatch("googleCreateFolder", {
        name: game.title,
        parentId: workingDirectoryId
      })

        .tap((folderId) => {
          // Create the local index version of the Folder
          return dispatch("createFolder", {
            id: folderId,
            name: game.title,
            parents: [workingDirectoryId]}
          ).then(() => {
            // set the new Folder to be this game's Folder
            return dispatch("patchGame", { id: game.id, folderId })
          })
        })
    },

    createSheetArtifactForGame({ dispatch }, game) {
      if(!game.folderId) { throw new Error("Game must have Folder ID to create Sheet.") }

      return dispatch("googleCreateSpreadsheet", {
        parentId: game.folderId,
        name: game.title
      }).then((spreadsheetId) => {
        // set the Sheet to be this Game's Sheet
        return dispatch("patchGame", { id: game.id, spreadsheetId })
      })
    },

    createImagesFolderArtifactForGame({ dispatch }, game) {
      if(!game.folderId) { throw new Error("Game must have Folder ID to create Images Folder.") }

      return dispatch("googleCreateFolder", {
        name: 'Images',
        parentId: game.folderId
      }).then((imageFolderId) => {
        // Create the local index version of the Images Folder
        return dispatch("createFolder", {
          id: imageFolderId,
          name: "Images",
          parents: [game.folderId]}
        )
      })
    },

    createDriveArtifactsForGameComponent({ dispatch }, { game, component }) {
      if(!game.spreadsheetId) { return Promise.resolve() }

      return Promise.try(() => {
        // Create the worksheet in Google Sheets
        return dispatch("googleAddSheetToSpreadsheet", {
          spreadsheetId: game.spreadsheetId,
          sheetName: component.title
        })
          // Link the newly created worksheet to the newly created component
          .then((worksheetId) => {
            return dispatch("patchComponent", {
              id: component.id,
              spreadsheetId: game.spreadsheetId,
              worksheetId
            })
          })
      })
    },

    createGameComponent({ dispatch, commit }, { game, component }) {
      // Create the component
      return dispatch("createComponent", component)
        .tap((componentId) => {
          // Link the component to the given game
          commit("pushGameComponentId", { game, componentId })
        })
    },

    copyGameComponent({ dispatch, commit }, { game, component }) {
      // Commit record to global collection begets an id
      return dispatch("copyComponent", component)
        .tap((componentId) => {
          // Commit only the record id to referencing collections
          commit("pushGameComponentId", { game, componentId })
        })
    },

    destroyGameComponent({ dispatch, commit }, { game, component }) {
      // Deletes the component
      dispatch("destroyComponent", component).then((componentId) => {
        // Removes the reference to the component
        // TODO: should this be handled by vuex_resource relationship support?
        commit("spliceGameComponentId", { game, componentId })
      })
    }
  }
}

const GamesModule = generateCrud(GameModel)

export default GamesModule
