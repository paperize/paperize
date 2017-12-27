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
  },

  actions: {
    updateGame({ commit, state, getters }, { game }) {
      let gameToUpdate = getters.findGame(game.id)

      commit("updateGame", { gameToUpdate, gameToCopy: game })
    },

    deleteGame({ commit }, { game }) {
      commit("deleteGame", { game })
      commit("clearActiveComponent")
    },
  }
}

export default GamesModule
