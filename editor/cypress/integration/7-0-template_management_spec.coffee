describe "Template management", ->
  beforeEach ->
    cy.loginAndEditGame()

  it "has the element and a title", ->
    cy.get("#template-editor").within ->
      cy.contains("Template")
