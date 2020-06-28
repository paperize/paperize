describe "Template management", ->
  beforeEach ->
    cy.loginAndEditGame("noLayersGame")
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

  it "has the element and a title", ->
    cy.get("#template-editor").within ->
      cy.contains("Template")

  it 'prompts about empty template until a layer is created', ->
    cy.contains("Empty Template")
    cy.contains("Add a Layer").click()
    cy.contains("Text").click()
    cy.contains("Empty Template").should("not.exist")

  it 'allows to copy a template from a component', ->
    cy.get(".template-selector").click()
    # cy.contains("Component").parent().click()
    cy.contains("Rainbow Deck").click()
    cy.contains("Copy").click()
    cy.contains("[text] 0")
    cy.contains("[text] 1")
