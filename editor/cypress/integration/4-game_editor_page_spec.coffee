describe "Game Editor page", ->
  beforeEach ->
    cy.loginAndEditGame()

  context "the GamePanel and GameForm", ->
    it "shows the game's vitals", ->
      cy.contains("Love Letter")

    it "lets me edit the game and updates the vitals", ->
      cy.contains("Edit Game").click()

      cy.get(".game-form").within ->
        cy.get(".game-title input")
          .clear()
          .type("Munchkin Love Letter")
        cy.get("button")
          .contains("Update")
          .click()

      cy.contains("Munchkin Love Letter")

    it "redirects back to games when i delete the game", ->
      cy.contains("Delete Game")
        .click()

      cy.get(".delete-game").within ->
        cy.get("button")
          .contains("Yes")
          .click()

      cy.url()
        .should("match", /games$/)

  context "the ComponentPanel and ComponentForm", ->
    it "lists components", ->
      cy.get('.component').its("length").should('eq', 3)

      cy.contains("Character Deck")
      cy.contains("Instruction Book")
      cy.contains("Point Cubes")

    it "defaults to the first component", ->
      cy.get('.component.active .headline').contains("Character Deck")

    it "lets me select a component", ->
      cy.contains("Instruction Book").click()
      cy.get('.component.active .headline').contains("Instruction Book")
      cy.contains("Point Cubes").click()
      cy.get('.component.active .headline').contains("Point Cubes")

    it "lets me add a component", ->
      cy.contains("New Component").click()

      cy.get(".component-form").within ->
        cy.contains("Component:")
        cy.typeIntoSelectors ".component-title input": 'Random Encounters'
        cy.get('.paper-format').click()

      cy.contains('Poker-sized Cards').click()
      cy.get(".component-form").within ->
        cy.contains("Close").click()

      cy.get('.component.active .headline')
        .contains("Random Encounters")

    it "lets me edit a component", ->
      cy.contains("Instruction Book")
        .click()

      cy.get('.component.active')
        .contains("Edit")
        .click()

      cy.get(".component-title input")
        .clear()
        .type('Instruction Manual')
      cy.get('.paper-format').click()
      cy.contains('Whole Page (A4)').click()
      cy.get('.component-form')
        .contains("Close")
        .click()

      cy.contains("Instruction Manual")

    it "lets me delete a component", ->
      cy.contains("Instruction Book")
        .click()

      cy.get('.component.active')
        .contains("Delete")
        .click()

      cy.get(".delete-component:visible").within ->
        cy.get("button")
          .contains("Yes")
          .click()

      cy.contains("Instruction Book")
        .should("not.exist")

    it "lets me print a component"
