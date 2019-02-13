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
      id:          uuid(),
      title:       "",
      folderId:    null,
      description: "",
      coverArt:    "",
      playerCount: "",
      playTime:    "",
      ageRange:    "",
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
    createGameAndDriveFolder({ dispatch, getters }, game) {
      return dispatch("createGame", game)
        .then((gameId) => {
          const workingDirectoryId = getters.workingDirectoryId
          return dispatch("googleCreateFolder", { name: game.title, parentId: workingDirectoryId })
            .then((folderId) => {
              const savedGame = getters.findGame(gameId)
              return dispatch("updateGame", { ...savedGame, folderId })
            })
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
