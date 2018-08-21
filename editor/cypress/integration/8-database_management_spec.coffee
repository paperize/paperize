describe "Database management", ->
  beforeEach ->
    cy.loginAndEditGame()

  it "lists how many of each resource i have", ->
    cy.contains("Database").click(force: true)
    cy.contains("Database Manager")
