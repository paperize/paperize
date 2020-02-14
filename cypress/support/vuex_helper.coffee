_ = require('lodash')

vuexCache = null
afterEach -> vuexCache = null

# grab the vuex store from the app under test
Cypress.Commands.add "vuex", ->
  if vuexCache
    cy.wrap(vuexCache)
  else
    cy.url().then (currentUrl) ->
      if currentUrl is 'about:blank'
        cy.visit('/')

      cy.window()
        .its("paperize.store")
      .then (vuex) ->
        vuexCache = vuex

# we need to call this after setting up our data
# or at the beginning of the test if there's no data to set up
Cypress.Commands.add "setStoreReady", ->
  cy.vuex().invoke("dispatch", "setStoreReady")

# cache the vuex store for speed
toReturn = null
afterEach -> toReturn = null

# grab the vuex store and all fixtures for fast-and-easy state fixturing!
Cypress.Commands.add "vuexAndFixtures", (callback) ->
  if toReturn
    cy.wrap(toReturn)
      .then(callback)

  else
    toReturn = {}

    cy
      .vuex()
      .then (vuex) ->
        toReturn.vuex = vuex
      .allFixtures()
      .then (allFixtures) ->
        toReturn.fixtures = allFixtures
      .wrap(toReturn)
      .then(callback)

Cypress.Commands.add "makePaperizeError", (numberOfErrors=1) ->
  cy.vuex().then (vuex) ->
    cy.fixture("errors").then (errors) ->
      # create the basic error N times
      _.times numberOfErrors, ->
        vuex.dispatch("createError", errors.basic)

Cypress.Commands.add "loginAndEditGame", (gameId = "loveLetter") ->
  cy.visit("/")
  cy.vuexAndFixtures ({ vuex, fixtures: { users, games, components, spreadsheets, cache, templates } }) ->
    gameToEdit = games[gameId]

    vuex.dispatch("become", users[0])
    vuex.commit("setGames", games)
    vuex.commit("setComponents", components)
    vuex.commit("setSpreadsheets", spreadsheets)
    _.each(cache, (value, key) ->
      vuex.commit("cache", { key: key, values: value }))
    vuex.commit("setTemplates", templates)

    if activeComponentId = gameToEdit.componentIds[0]
      cy.visit("/#/games/#{gameToEdit.id}/components/#{activeComponentId}")
    else
      cy.visit("/#/games/#{activeComponentId}")

    vuex.dispatch("setStoreReady")

Cypress.Commands.add "login", ->
  cy.visit("/")
  cy.vuexAndFixtures ({ vuex, fixtures: { users } }) ->
    vuex.dispatch("become", users[0])
    vuex.dispatch("setStoreReady")

Cypress.Commands.add "loadGamesIntoVuex", ->
  cy.vuexAndFixtures ({ vuex, fixtures: { games } }) ->
    vuex.commit("setGames", games)
