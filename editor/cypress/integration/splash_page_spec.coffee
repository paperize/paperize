describe "Splash Page", ->
  beforeEach ->
    cy.visit("/")

  it "has a nice title", ->
    cy.contains("Welcome to New Paperize!")
