describe "Game Editor page", ->
  beforeEach ->
    cy.login()
    cy.loadGameFixtures()
    cy.visitFixtureGame("loveLetter")

  context "the GamePanel and GameForm", ->
    it "shows the game's vitals", ->
      cy.contains("Love Letter")
      cy.contains("Chaotic microgame")
      cy.contains("6+")
      cy.contains("2-4")
      cy.contains("5-45 minutes")

    it "lets me edit the game and updates the vitals", ->
      cy.contains("Edit Game").click()

      cy.get("input[name=title]").clear().type("Munchkin Love Letter")
      cy.get("button[type=submit]").click()

      cy.contains("Munchkin Love Letter")

    it "redirects back to games when i delete the game", ->
      cy.contains("Delete Game").click()

      cy.url().should("match", /games$/)

  context "the ComponentPanel and ComponentForm", ->
    it "lists components", ->
      cy.get('.component-card').its("length").should('eq', 3)

      cy.contains("Character Deck")
      cy.contains("Instruction Book")
      cy.contains("Point Cubes")

    it "lets me select a component", ->
      cy.get('.active-component').contains("No Component Selected")
      cy.contains("Instruction Book").click()
      cy.get('.active-component').contains("Instruction Book")
      cy.contains("Point Cubes").click()
      cy.get('.active-component').contains("Point Cubes")


    it "lets me add a component"
    it "lets me edit a component"
    it "lets me print a component"
    it "lets me delete a component"
