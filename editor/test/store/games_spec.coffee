store = require("../../lib/store")

game = require("../../cypress/fixtures/games").loveLetter

assert = require('assert')

describe "Games Store", ->
  context "deleting a game", ->
    it "clears activeComponent", ->
      store.commit("setGames", [game])

      store.dispatch("setActiveGame", { gameId: game.id })
      store.dispatch("setActiveComponent", { component: game.components[0] })

      store.dispatch("deleteGame", { game })

      assert.equal(null, store.getters.activeComponent)
