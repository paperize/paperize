{ get } = require('lodash')
store = require("../../lib/store")
p = require("../../lib/store/persistence")

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
    queryStatePath = (query) ->
      console.log("state.#{query}:", _(store.state).get(query))

    # spy all over my persistence layer
    sandbox.spy(p, "openDatabase")
    sandbox.spy(p, "closeDatabase")
    sandbox.spy(p, "saveState")
    sandbox.spy(p, "loadState")

    queryStatePath('user.idToken')
    # invoke store actions and verify the persistence layer
    store.dispatch("become", userFixture)
    expect(p.openDatabase).to.be.calledWith(userFixture.idToken)
    queryStatePath('user.idToken')

    queryStatePath('games.games')
    store.commit("createGame", { game: gameFixture })
    expect(p.saveState).to.be.calledOnce
    expect(p.saveState).to.be.calledWith(store.state)
    queryStatePath('games.games')

    store.commit("createGame", { game: gameFixture })
    expect(p.saveState).to.be.calledTwice
    queryStatePath('games.games')
