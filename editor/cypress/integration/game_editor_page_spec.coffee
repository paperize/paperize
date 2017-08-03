describe.only "Game Editor page", ->
  beforeEach ->
    cy.login()
    cy.loadGameFixtures()
    cy.visitFixtureGame("loveLetter")

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
