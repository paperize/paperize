describe "Layer Management", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Image").click()

  it 'toggles visibility of layer', ->
    cy.get(".layer-list").within ->
      cy.get(".mdi-eye").click()
      cy.get(".mdi-eye-off").should("exist")
      cy.get(".mdi-eye").should("not.exist")

  it 'allows to cancel deleting a layer', ->
    cy.get(".layer-list").within ->
      cy.contains("delete").click()
    cy.contains("No").click()
    cy.get(".layer-list").within ->
      cy.contains("delete").should("exist")
  
  it 'allows to cancel deleting a layer', ->
    cy.get(".layer-list").within ->
      cy.contains("delete").click()
    cy.contains("Yes").click()
    cy.get(".layer-list").within ->
      cy.contains("delete").should("not.exist")

  it 'allows to select a layer as highlighted', ->
    # This seems to be a problem with vuetify and checkboxes.
    # https://stackoverflow.com/questions/51286835/cypress-vuetify-checkbox-not-identified
    cy.get("#highlight-layer").parent().click()
    cy.get("#highlight-layer").should("be.enabled")