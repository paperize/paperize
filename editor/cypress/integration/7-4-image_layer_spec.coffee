describe "Image Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Image").click()

  it 'works', ->
