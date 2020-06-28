describe "Game Editor page", ->
  beforeEach ->
    cy.loginAndEditGame()

  context "the GamePanel and GameForm", ->
    it "shows the game's vitals", ->
      cy.contains("Love Letter")

    it "lets me edit the game and updates the vitals", ->
      cy.get('.edit-game-button').click()

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
        cy.contains("New Component")
        cy.typeIntoSelectors ".component-title input": 'Random Encounters'
        cy.get(".component-add-sheet-to-source input").uncheck(force: true)
        cy.contains("Create Component").click()

      cy.get('.component.active .headline')
        .contains("Random Encounters")

    it.only "lets me copy a component", ->
      cy.contains("New Component").click()

      cy.get(".component-form").within ->
        cy.contains("New Component")
        cy.typeIntoSelectors ".component-title input": 'Random Encounters'

      cy.contains("Copy Existing Component").click()
      cy.get(".component-selector").click()
      cy.contains("Character Deck").click()
      cy.contains("Copy Component").click()

      cy.get('.component.active .headline')
        .contains("Random Encounters")
      cy.contains("Love Letter")

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
        .contains("Done")
        .click()

      cy.contains("Instruction Manual")

    it "lets me copy a component from edit modal", ->
      cy.contains("Instruction Book")
        .click()

      cy.get('.component.active')
        .contains("Edit")
        .click()

      cy.get(".mdi-content-copy").click()

      cy.contains("Instruction Book Copy")

    it "displays correctly the size settings of a custom size component", ->
      cy.contains("Point Cubes")
        .click()

      cy.get('.component.active')
        .contains("Edit")
        .click()

      cy.get('.paper-width input').should('have.value', '1.5')
      cy.get('.paper-height input').should('have.value', '1.5')
      cy.get('.component-form')
        .contains("Done")
        .click()

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
