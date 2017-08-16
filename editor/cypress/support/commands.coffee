# You can read more about custom commands here:
# https://on.cypress.io/api/commands

ID_TOKEN = "avid_gamer@example.com"
PROFILE =
  name: "Avid Gamer"
  avatarSrc: "http://placehold.it/20/20"
  email: ID_TOKEN

Cypress.addParentCommand "login", ->
  log = Cypress.Log.command
    name: "login"
    message: [PROFILE.name]
    consoleProps: ->
      id: ID_TOKEN
      name: PROFILE.name

  localStorage.setItem('id_token', ID_TOKEN)

  persistenceItem = {}
  persistenceItem[ID_TOKEN] =
    profile: PROFILE
    games: []

  localStorage.setItem 'persistence', JSON.stringify(persistenceItem)

  log.snapshot().end()

Cypress.addParentCommand "loadGameFixtures", () ->
  cy.fixture("games").then (games) ->
    cy.setGames(Cypress._.values(games))

Cypress.addParentCommand "setGames", (games) ->
  log = Cypress.Log.command
    name: "setGames"
    message: ["#{games.length} games"]

  persistenceItem = JSON.parse(localStorage.getItem("persistence"))
  throw new Error("No persistence detected. Did you remember to `cy.login()` first?") unless persistenceItem

  persistenceItem[ID_TOKEN].games = games
  localStorage.setItem("persistence", JSON.stringify(persistenceItem))

  log.snapshot().end()

Cypress.addParentCommand "visitFixtureGame", (fixtureKey) ->
  cy.fixture("games").its("#{fixtureKey}.id").then (gameId) ->
    cy.visit("/#/games/#{gameId}")

Cypress.addParentCommand "typeIntoSelectors", (inputTextPairs) ->
  cy.wrap(inputTextPairs).then (selectorsAndText) ->
    for key in Object.keys selectorsAndText
      cy.get(key).type(selectorsAndText[key])

    return null
