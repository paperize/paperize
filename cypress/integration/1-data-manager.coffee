describe "Data Manager", ->
  it "has a happy-path for first-time users:"
    # if all db/user checks come back negative
    # just start Paperize with local persistence
    # promote to remote-synced later, upon login

  # 5 Ideal States:
  context "App modes", ->
    # Blank
    it "Mode: Empty"
      # uses empty router
      # Data Manager rendered
      # automatic database/login detectors run in background
      # detectors return negative or timeout, start first-timer happy-path

    # Loading
    it "Mode: Loading"

    # Partial
    it "Mode: Database Active"
      # a database has been loaded into the system successfully
      # mount the router

    # Ideal
    it "Mode: Database Active w/ Remote Sync"
      # remote data source auth acquired
      # subscription to store set up for db sync

    # Errors (probably)
    it "Mode: Errors"

  context "Empty state", ->
    beforeEach ->
      cy.visit "/"
      # cy.setStoreReady()

    it "Starts in empty mode", ->
      cy.vuex()
        .its("getters.appMode")
        .should("equal", "empty")

    it "Shows the data manager's state", ->
      cy.contains "Data Manager"
      cy.contains "No Database Selected"
      cy.contains "No User Selected"

    it.only "Starts background checks for local db/login/remote db", ->


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
