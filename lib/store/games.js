import uuid from 'uuid/v4'
import { find, filter, includes } from 'lodash'
import { generateCrud } from './util/vuex_resource'
import { PRINT_SELECT_COMPONENTS, PRINT_ALL_COMPONENTS } from './print'

const INITIAL_CREATION = "initial_creation"
const CREATING_GAME_FOLDER = "creating_game_folder"
const CREATING_IMAGE_FOLDER_AND_SPREADSHEET = "creating_image_folder_and_spreadsheet"
const CREATION_COMPLETED = "creation_completed"


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
      creationStatus: INITIAL_CREATION,
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
    createDriveArtifacts({ dispatch, getters }, { game }) {
      // gameFolder, createComponentSpreadsheet, createmageFolder })
      const workingDirectoryId = getters.workingDirectoryId
      let outerFolderId

      // Create a folder in Google Drive for the game
      dispatch("patchGame", {
        id: game.id,
        creationStatus: CREATING_GAME_FOLDER
      })
      return dispatch("googleCreateFolder", {
        name: game.title,
        parentId: workingDirectoryId
      }).tap((folderId) => {
        return dispatch("createFolder", {
          id: folderId,
          name: game.title,
          parents: [workingDirectoryId]}
        )
      })

        // Add index entry for the folder we just created.
        .then((folderId) => {
          outerFolderId = folderId
          dispatch("patchGame", {
            id: game.id,
            creationStatus: CREATING_IMAGE_FOLDER_AND_SPREADSHEET
          })
          let promises = []
          if(folderId) {
            // Create a spreadsheet on Google Drive to hold components
            promises.push(dispatch("googleCreateSpreadsheet", {
              parentId: folderId,
              name: game.title
            }))
          } else {
            promises.push(Promise.resolve(null))
          }

          if(folderId) {
            // Create a folder inside the game folder for images
            promises.push(dispatch("googleCreateFolder", {
              name: 'Images',
              parentId: folderId
            }).then((imageFolderId) => {
              return dispatch("createFolder", {
                id: imageFolderId,
                name: "Images",
                parents: [folderId]}
              )
            })
            )
          } else {
            promises.push(Promise.resolve(null))
          }

          return Promise.all(promises)
        })

        .spread((spreadsheetId) => {
          // Re-save the game with the new remote ids
          return dispatch("patchGame", {
            id: game.id,
            folderId: outerFolderId,
            creationStatus: CREATION_COMPLETED,
            spreadsheetId // may be null, don't care
          })

        })
    },

    createGameComponentAndDriveArtifacts({ dispatch }, { game, component, addSheetToSource }) {
      return dispatch("createGameComponent", { game, component })
        .tap((componentId) => {
          // Create the worksheet in Google Sheets
          if(addSheetToSource && game.spreadsheetId) {
            return dispatch("googleAddSheetToSpreadsheet", {
              spreadsheetId: game.spreadsheetId,
              sheetName: component.title
            })

              // Link the newly created worksheet to the newly created component
              .then((worksheetId) => {
                return dispatch("patchComponent", {
                  id: componentId,
                  spreadsheetId: game.spreadsheetId,
                  worksheetId
                })
              })
          }
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
