describe "Splash Page", ->
  beforeEach ->
    cy.visit("/")

  it.only "has a nice title", ->
    cy.contains("Welcome to Paperize!")
