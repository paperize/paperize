_ = require('lodash')

vuexCache = null
afterEach -> vuexCache = null

# grab the vuex store from the app under test
Cypress.Commands.add "vuex", ->
  if vuexCache
    cy.wrap(vuexCache)
  else
    cy
      .visit('/')
      .window()
        .its("paperize.store")
      .then (vuex) ->
        vuexCache = vuex

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

Cypress.Commands.add "visitActiveGameAndComponent", ->
  cy.vuex().then (vuex) ->
    cy.visit("/#/games/#{vuex.getters.activeGame.id}/components/#{vuex.getters.activeComponent.id}")

Cypress.Commands.add "makePaperizeError", (numberOfErrors=1) ->
  cy.vuex().then (vuex) ->
    cy.fixtures("errors").then (errors) ->
      vuex.commit("setErrors", _.take(errors, numberOfErrors))

Cypress.Commands.add "loginAndEditGame", ->
  cy.vuexAndFixtures ({ vuex, fixtures: { users, games, components, spreadsheets, cache, templates } }) ->
    loveLetter = games['loveLetter']

    vuex.dispatch("become", users[0])
    vuex.commit("setGames", games)
    vuex.commit("setComponents", components)
    vuex.commit("setSpreadsheets", spreadsheets)
    _.each(cache, (value, key) ->
      vuex.commit("cache", { key: key, values: value }))
    vuex.commit("setTemplates", templates)
    vuex.dispatch("setActiveGame", loveLetter.id)
    vuex.dispatch("setActiveComponent", loveLetter.componentIds[0])
    vuex.dispatch("setStoreReady")

  .visitActiveGameAndComponent()

Cypress.Commands.add "login", ->
  cy.vuexAndFixtures ({ vuex, fixtures: { users } }) ->
    vuex.dispatch("become", users[0])
    vuex.dispatch("setStoreReady")

Cypress.Commands.add "loadGamesIntoVuex", ->
  cy.vuexAndFixtures ({ vuex, fixtures: { games } }) ->
    vuex.commit("setGames", games)
