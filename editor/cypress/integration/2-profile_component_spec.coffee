describe "Profile component", ->
  it "without login we see Sign In", ->
    cy.visit("/")
    cy.contains("Sign In")

  it "with login we see name and Sign Out", ->
    cy.login()
    cy.contains("Avid Gamer")
    cy.contains("Sign Out")
