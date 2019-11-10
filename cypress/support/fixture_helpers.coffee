_ = require('lodash')

# shorthand for loading more than one fixture at once
Cypress.Commands.add "fixtures", (fixtureNames) ->
  unless(_.isArray(fixtureNames))
    fixtureNames = [fixtureNames]

  fixtures = {}

  cy.wrap(fixtureNames).each (fixtureName) ->
    cy.fixture(fixtureName).then (fixture) ->
      fixtures[fixtureName] = fixture
  .then ->
    return cy.wrap(fixtures)

# shorthand for loading all fixtures
Cypress.Commands.add "allFixtures", ->
  cy.fixtures(["users", "games", "components", "spreadsheets", "cache", "templates"])
