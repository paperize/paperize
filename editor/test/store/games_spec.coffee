import store from "../../lib/store"
import { loveLetter } from "../../cypress/fixtures/games"
import assert from 'assert'

describe "Games Store", ->
  context "deleting a game", ->
    it "clears activeComponent", ->
      store.commit("setGames", [loveLetter])

      store.dispatch("setActiveGame", { gameId: loveLetter.id })
      store.dispatch("setActiveComponent", { component: loveLetter.components[0] })

      store.dispatch("deleteGame", { loveLetter })

      assert.equal(null, store.getters.activeComponent)
