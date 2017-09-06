# shorthand for loading more than one fixture at once
Cypress.addParentCommand "fixtures", (fixtureNames) ->
  fixtures = {}

  cy.chain().wrap(fixtureNames).each (fixtureName) ->
    cy.chain().fixture(fixtureName).then (fixture) ->
      fixtures[fixtureName] = fixture
  .then ->
    return cy.chain().wrap(fixtures)

# shorthand for loading all fixtures
Cypress.addParentCommand "allFixtures", ->
  cy.chain().fixtures(["users", "games", "sources"])
