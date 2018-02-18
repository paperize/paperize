import { find } from 'lodash'
import uuid from 'uuid/v4'

const GamesModule = {
  state: {
    games: [],
  },

  getters: {
    games: state => state.games,

    findGame: state => id => {
      let foundGame = find(state.games, { id })
      if(!foundGame){
        throw new Error(`No game found with id: ${ id }`)
      } else {
        return foundGame
      }
    },

    findAllGameComponents: (state, getters, rootState, rootGetters) => game => {
      return rootGetters.findAllComponents(game.componentIds)
    }
  },

  mutations: {
    setGames(state, games) {
      state.games = games
    },

    createGame(state, { game }) {
      game.id = game.id || uuid()
      state.games.push(game)
    },

    updateGame(state, { gameToUpdate, gameToCopy }) {
      Object.assign(gameToUpdate, gameToCopy)
    },

    deleteGame(state, { game }) {
      state.games.splice(state.games.indexOf(game), 1)
    },

    pushGameComponentId(state, { game, componentId }) {
      game.componentIds.push(componentId)
    },

    spliceGameComponentId(state, { game, componentId }) {
      // remove the component in question
      game.componentIds.splice(game.componentIds.indexOf(componentId), 1)
    }
  },

  actions: {
    createGameComponent({ dispatch, commit }, { game, component }) {
      return dispatch("createComponent", component).then((componentId) => {
        commit("pushGameComponentId", { game, componentId })
        return componentId
      })
    },

    updateGame({ commit, state, getters }, { game }) {
      let gameToUpdate = getters.findGame(game.id)
      commit("updateGame", { gameToUpdate, gameToCopy: game })
    },

    deleteGame({ commit, dispatch }, { game }) {
      dispatch("clearActiveGame")
      commit("deleteGame", { game })
    },

    destroyGameComponent({ dispatch, commit }, { game, component }) {
      dispatch("destroyComponent", component).then((componentId) => {
        commit("spliceGameComponentId", { game, componentId })
      })
    }
  }
}

export default GamesModule
