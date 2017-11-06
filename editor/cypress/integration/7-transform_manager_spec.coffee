describe "Transform Manager", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.loadSourcesIntoVuex()
    cy.contains("Love Letter Revisited").click()

  it "works", ->
    cy.get('#transform-manager')
