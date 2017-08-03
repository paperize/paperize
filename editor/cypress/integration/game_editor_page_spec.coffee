describe "Game Editor page", ->
  beforeEach ->
    cy.login()
    cy.loadGameFixtures()
    cy.visitFixtureGame("loveLetter")

  it "shows the game's vitals", ->
    cy.contains("Love Letter")

  it "lets me edit the game and updates the vitals"
  it "redirects back to games when i delete the game", ->
    cy.contains("Delete Game").click()

    cy.url().should("match", /games$/)
