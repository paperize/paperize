describe "Template management", ->
  beforeEach ->
    cy.loginAndEditGame("noLayersGame")
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

  it "has the element and a title", ->
    cy.get("#template-editor").within ->
      cy.contains("Template")

  it 'allows to create new template', ->
    cy.contains("New Template").click()
    cy.contains("library_add")

  it 'allows to copy a template from a component', ->
    cy.contains("Copy Template").click()
    cy.contains("Component").parent().click()
    cy.contains("Rainbow Deck").click()
    cy.contains("[text] 0")
    cy.contains("[text] 1")