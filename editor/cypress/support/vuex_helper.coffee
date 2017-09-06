
vuexCache = null
afterEach -> vuexCache = null

# grab the vuex store from the app under test
Cypress.addParentCommand "vuex", ->
  if vuexCache
    cy.chain().wrap(vuexCache)
  else
    cy.chain()
      .visit('/')
      .window()
        .its("paperize.store")
      .then (vuex) ->
        vuexCache = vuex

# cache the vuex store for speed
toReturn = null
afterEach -> toReturn = null

# grab the vuex store and all fixtures for fast-and-easy state fixturing!
Cypress.addParentCommand "vuexAndFixtures", ->
  if toReturn
    cy.chain().wrap(toReturn)
  else
    toReturn = {}

    cy.chain()
      .vuex()
      .then (vuex) ->
        toReturn.vuex = vuex
      .allFixtures()
      .then (allFixtures) ->
        toReturn.fixtures = allFixtures
      .wrap(toReturn)

Cypress.addParentCommand "visitActiveGameAndComponent", ->
  cy.chain().vuex().then (vuex) ->
    cy.visit("/#/games/#{vuex.getters.activeGame.id}/components/#{vuex.getters.activeComponent.id}")

Cypress.addParentCommand "loginAndEditGame", ->
  cy.vuexAndFixtures().then ({ vuex, fixtures: { users, games } }) ->
    allGames = Object.values(games)
    loveLetter = games['loveLetter']
    firstComponent = loveLetter.components[0]

    vuex.dispatch("become", users[0])
    vuex.commit("setGames", { games: allGames })
    vuex.dispatch("setActiveGame", { gameId: loveLetter.id })
    vuex.dispatch("setActiveComponent", { component: firstComponent })

  .visitActiveGameAndComponent()

Cypress.addParentCommand "login", ->
  cy.vuexAndFixtures().then ({ vuex, fixtures: { users } }) ->
    vuex.dispatch("become", users[0])

Cypress.addParentCommand "loadGamesIntoVuex", ->
  cy.vuexAndFixtures().then ({ vuex, fixtures: { games } }) ->
    vuex.commit("setGames", { games: Object.values(games) })
