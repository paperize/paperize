describe "Game Editor page", ->
  beforeEach ->
    cy.loginAndEditGame()

  context "the GamePanel and GameForm", ->
    it "shows the game's vitals", ->
      cy.contains("Love Letter")
      cy.contains("Chaotic microgame")
      cy.contains("6+")
      cy.contains("2-4")
      cy.contains("5-45 minutes")

    it "lets me edit the game and updates the vitals", ->
      cy.contains("Edit Game").click()

      cy.get(".game-form input[name=title]").clear().type("Munchkin Love Letter")
      cy.get(".game-form button[type=submit]").click()

      cy.contains("Munchkin Love Letter")

    it "redirects back to games when i delete the game", ->
      cy.contains("Delete Game").click()

      cy.url().should("match", /games$/)

  context "the ComponentPanel and ComponentForm", ->
    it "lists components", ->
      cy.get('.component').its("length").should('eq', 3)

      cy.contains("Character Deck")
      cy.contains("Instruction Book")
      cy.contains("Point Cubes")

    it "defaults to the first component", ->
      cy.get('.active-component').contains("Character Deck")

    it "lets me select a component", ->
      cy.contains("Instruction Book").click()
      cy.get('.active-component').contains("Instruction Book")
      cy.contains("Point Cubes").click()
      cy.get('.active-component').contains("Point Cubes")

    it "lets me add a component", ->
      cy.contains("New Component").click()
      cy.contains("Add a Component")

      cy.typeIntoSelectors "input.component-title-new": 'Random Encounters'
      cy.get('select.component-type-new').select('deck')
      cy.contains("Create Component").click()

      cy.contains("Random Encounters")

    it "lets me edit a component", ->
      cy.contains("Instruction Book").click()

      cy.get('.component.active').contains("Edit").click()

      cy.get("input#component-title-instruction-book").clear().type('Instruction Manual')
      cy.get('select#component-type-instruction-book').select('deck')
      cy.get('.component-form').contains("Edit Component").click()

      cy.contains("Deck")
      cy.contains("Instruction Manual")

    it "lets me delete a component", ->
      cy.contains("Instruction Book").click()

      cy.get('.component.active').contains("Delete").click()

      cy.contains("Instruction Book").should("not.exist")

    it "lets me print a component"
