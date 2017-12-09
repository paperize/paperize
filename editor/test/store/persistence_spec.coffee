{ get } = require('lodash')
import store from "../../lib/store"
import p from "../../lib/store/persistence"

userFixture = require("../../cypress/fixtures/users")[0]
gameFixture = require("../../cypress/fixtures/games").loveLetter

describe "Persistence", ->
  it "works with multiple users", ->
    p.openDatabase("abc123.loren").then ->
      p.saveState({ user: { idToken: 'loren' } }).then ->
        p.closeDatabase().then ->
          # open a different db and find empty
          p.openDatabase("xyz456.benji").then ->
            p.loadState().then (benjiState) ->
              expect(benjiState).to.eql(null)

              p.closeDatabase().then ->
                # reopen and find same
                p.openDatabase("abc123.loren").then ->
                  p.loadState().then (lorenState) ->
                    expect(lorenState).to.eql({ user: { idToken: 'loren' } })

  it "opens a database when store becomes a user", ->
    # spy all over my persistence layer
    sandbox.spy(p, "openDatabase")
    sandbox.spy(p, "closeDatabase")
    sandbox.spy(p, "saveState")
    sandbox.spy(p, "loadState")

    p.initializeAndWatchStore(store)
    # invoke store actions and verify the persistence layer
    store.dispatch("become", userFixture)
    expect(p.openDatabase).to.be.calledWith(userFixture.idToken)

    store.commit("createGame", { game: gameFixture })
    expect(p.saveState).to.be.calledOnce
    expect(p.saveState).to.be.calledWith(store.state)

    store.commit("createGame", { game: gameFixture })
    expect(p.saveState).to.be.calledTwice
