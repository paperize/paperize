import { find } from 'lodash'
import uuid from 'uuid/v4'

import { generateCrud } from './vuex_resource'

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
    }
  },

  mutations: {
    setGames(state, games) {
      state.games = games
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

    destroyGameComponent({ dispatch, commit }, { game, component }) {
      dispatch("destroyComponent", component).then((componentId) => {
        commit("spliceGameComponentId", { game, componentId })
      })
    }
  }
}

const GamesModule = generateCrud(GameModel)

export default GamesModule
