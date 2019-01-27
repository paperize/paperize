xdescribe "Database Manager", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("button")
      .contains("Database")
      .click()

  it "has a title", ->
    cy.contains("Database Manager")

  context "with selected database", ->
    beforeEach ->
      cy.contains("avid_gamer@example.com").click()

    it "lists resource counts", ->
      cy.get('.games-total').contains("3")

    it "can clear the database", ->
      cy.get(".database-manager").within ->
        cy.get("button")
          .contains("Clear")
          .click()

      cy.get(".database-clear").within ->
        cy.contains("Are you sure?")
        cy.get("button")
          .contains("Clear Database")
          .click()

      cy.get('.games-total')
        .contains("0")

      cy.url().should('match', /games$/)

    it "can export as JSON", ->
      cy.contains("Export").click()
