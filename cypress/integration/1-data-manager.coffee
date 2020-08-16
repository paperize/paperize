describe "Data Manager", ->
  it "has a happy-path for first-time users:"
    # if all db/user checks come back negative
    # just start Paperize with local persistence
    # promote to remote-synced later, upon login

  context "App modes", ->
    it "Mode: Empty"
      # router not installed
      # Data Manager rendered
      # automatic database/login detectors run in background
      # detectors negative or timedout, start first-timer happy-path

    it "Mode: Database Active"
      # a database has been loaded into the system successfully
      # mount the router

    it "Mode: Database Active w/ Remote Sync"
      # remote data source auth acquired
      # subscription to store set up for db sync

  context "Empty state", ->
    beforeEach ->
      cy.visit "/"
      # cy.setStoreReady()

    it.only "Starts in empty mode", ->
      cy.vuex().then (vuex) ->
        expect(vuex.getters.appMode).equal("empty")

    it "Appear at the root", ->
      cy.contains "Data Manager"

    it "Says no database is selected", ->
      cy.contains "No Database Selected"

    it "Says no user is logged in", ->
      cy.contains "No User Selected"

  context "Selecting local persistence", ->
    it "creates a database in localStore/IndexedDB"
    it "does not require a login"

  context "Selecting remote persistence", ->
    it "shows Google as an option"
    it "requires a Google login"
    it "creates a database file in Google Drive"
    it "creates a local cache"

  context "With existing local persistence", ->
    it "routes to the game manager"
    it "shows no one logged in"

  context "With existing remote persistence", ->
    it "loads local cache, then remote"
