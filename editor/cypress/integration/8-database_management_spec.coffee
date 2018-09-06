describe "Database Manager", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.contains("Database").click(force: true)

  it "has a title", ->
    cy.contains("Database Manager")

  it "lists resource counts", ->
    cy.get('.games-total').contains("3")

  it "can clear the database", ->
    cy.contains("Clear").click()
    cy.contains("Are you sure?")
    cy.contains("Yes").click()
    cy.get('.games-total').contains("0")
    cy.url().should('match', /games$/)
