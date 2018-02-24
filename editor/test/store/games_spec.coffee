import store from "../../lib/store"
import gameFixtures from "../../cypress/fixtures/games"
import componentFixtures from "../../cypress/fixtures/components"
import assert from 'assert'

describe "Games Store", ->
  context "deleting a game", ->
    it "clears activeComponent", ->
      loveLetter = gameFixtures.loveLetter

      store.commit("setGames", gameFixtures)
      store.commit("setComponents", componentFixtures)

      store.dispatch("setActiveGame", loveLetter.id)
      store.dispatch("setActiveComponent", store.getters.findAllGameComponents(loveLetter)[0].id)

      store.dispatch("destroyGame", loveLetter).then ->
        assert.equal(null, store.getters.activeComponent)
