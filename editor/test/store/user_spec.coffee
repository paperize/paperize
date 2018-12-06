actions = require("../../lib/store/user").default.actions

# Make it easier to fake out actions
dispatchHelper = (actionMap) ->
  return (actionName) ->
    if action = actionMap[actionName]
      action()
    else
      fake.resolves()

describe "User Module", ->
  beforeEach ->
    @fakegoogleLogin = fake.resolves({
      getBasicProfile: ->
        getName: -> "Avid Gamer"
        getEmail: -> "avid_gamer@example.com",
        getImageUrl: -> "./images/blank_avatar.png"
      })
    @fakeGoogleDatabaseLookup = fake.resolves({})
    @fakeGoogleDatabaseInitialize = fake.resolves({})
    @fakeResetState = fake.resolves({})

  context "without an existing database", ->
    beforeEach ->
      @fakeGoogleDatabaseLookup = fake.resolves(false)

    it "logs in, finds no database, then creates one", ->
      commit = ->
      dispatch = dispatchHelper({
        resetState: @fakeResetState,
        googleLogin: @fakegoogleLogin,
        googleDatabaseLookup: @fakeGoogleDatabaseLookup,
        googleDatabaseInitialize: @fakeGoogleDatabaseInitialize,
      })

      actions.login({ commit, dispatch })

      .then =>
        expect(@fakegoogleLogin).to.be.called
        expect(@fakeGoogleDatabaseLookup).to.be.called
        expect(@fakeGoogleDatabaseInitialize).to.be.called
        expect(@fakeResetState).not.to.be.called

  context "with an existing database", ->
    beforeEach ->
      @fakeGoogleDatabaseLookup = fake.resolves({
        # some db shit here
      })
      @fakeGoogleDatabaseInitialize = fake.resolves({})

    it "logs in, looks up the database, then loads it", ->
      commit = ->
      dispatch = dispatchHelper({
        resetState: @fakeResetState,
        googleLogin: @fakegoogleLogin,
        googleDatabaseLookup: @fakeGoogleDatabaseLookup,
        googleDatabaseInitialize: @fakeGoogleDatabaseInitialize,
      })

      actions.login({ commit, dispatch })

      .then =>
        expect(@fakegoogleLogin).to.be.called
        expect(@fakeGoogleDatabaseLookup).to.be.called
        expect(@fakeGoogleDatabaseInitialize).not.to.be.called
        expect(@fakeResetState).to.be.called
