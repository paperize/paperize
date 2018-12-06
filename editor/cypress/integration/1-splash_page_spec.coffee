describe "Splash Page", ->
  beforeEach ->
    cy.visit("/")

  it "has Benefits", ->
    cy.contains("Benefits")

  it "has Get Started call-to-action", ->
    cy.contains("Get Started")

  it "has Sign In", ->
    cy.contains("Sign In")

  it "has Paperize.io", ->
    cy.contains("Paperize.io")
