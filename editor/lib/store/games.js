import uuid from 'uuid/v4'
import { find, includes } from 'lodash'
import { generateCrud } from './util/vuex_resource'

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
      sourceId:      null,
      componentIds:  [ ],
      // Override with given
      ...newGame
    }
  },

  getters: {
    findAllGameComponents: (_, __, ___, rootGetters) => game => {
      return rootGetters.findAllComponents(game.componentIds)
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
    createGameAndDriveArtifacts({ dispatch, getters }, { game, gameFolder, componentSpreadsheet, imageFolder }) {
      const workingDirectoryId = getters.workingDirectoryId
      let outerGameId,
        outerFolderId

      // Create the game in our local collection
      return dispatch("createGame", game)
        .then((gameId) => {
          // Optional: Create a folder in Google Drive for the game
          outerGameId = gameId
          if(gameFolder) {
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
          }
        })

        // Add index entry for the folder we just created.
        .then((folderId) => {
          outerFolderId = folderId
          let promises = []
          if(folderId && componentSpreadsheet) {
            // Optional: Create a spreadsheet on Google Drive to hold components
            promises.push(dispatch("googleCreateSpreadsheet", {
              parentId: folderId,
              name: game.title
            }).then((sheetId) => {
              return dispatch("createSheet", {
                id: sheetId,
                name: game.title,
                parents: [folderId]}
              )
            }))
          } else {
            promises.push(Promise.resolve(null))
          }

          if(folderId && imageFolder) {
            // Optional: Create a folder inside the game folder for images
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
          if(gameFolder) {
            // Re-save the game with the new remote ids
            return dispatch("patchGame", {
              id: outerGameId,
              folderId: outerFolderId,
              sourceId: spreadsheetId // may be null, don't care
            })
          }
        })
    },

    createGameComponentAndDriveArtifacts({ dispatch }, { game, component, addSheetToSource }) {
      return dispatch("createGameComponent", { game, component })
        .tap((componentId) => {
          if(addSheetToSource && game.sourceId) {
            return dispatch("googleAddSheetToSpreadsheet", {
              spreadsheetId: game.sourceId,
              sheetName: component.title
            })

              .then(() => {
                return dispatch("patchComponent", {
                  id: componentId,
                  sourceId: game.sourceId,
                  worksheetId: component.title
                })
              })
          }
        })
    },

    createGameComponent({ dispatch, commit }, { game, component }) {
      return dispatch("createComponent", component)
        .tap((componentId) => {
          commit("pushGameComponentId", { game, componentId })
        })
    },

    destroyGameComponent({ dispatch, commit }, { game, component }) {
      dispatch("destroyComponent", component).then((componentId) => {
        commit("spliceGameComponentId", { game, componentId })
      })
    }
  }
}

const GamesModule = generateCrud(GameModel)

export default GamesModule
