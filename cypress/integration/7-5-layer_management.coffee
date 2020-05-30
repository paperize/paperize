describe "Layer Management", ->
  beforeEach ->
    cy.loginAndEditGame("carcassonneWithComponent")
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

  it 'toggles visibility of layer', ->
    cy.get(".layer-list").within ->
      cy.get(".mdi-eye").click()
      cy.get(".mdi-eye-off").should("exist")
      cy.get(".mdi-eye").should("not.exist")

  it 'copies layer', ->
    cy.get(".layer-list").within ->
      cy.get(".mdi-content-copy").click()
    cy.contains("[shape] 0 (copy)")
    cy.get("#dimension-editor").within ->
      cy.get("#dim-y").invoke("val").should("eq", "20.0")

  it 'allows to cancel deleting a layer', ->
    cy.get(".layer-list").within ->
      cy.contains("delete").click()
    cy.contains("No").click()
    cy.get(".layer-list").within ->
      cy.contains("delete").should("exist")
  
  it 'allows to delete a layer', ->
    cy.get(".layer-list").within ->
      cy.contains("delete").click()
    cy.contains("Yes").click()
    cy.contains("New Template")

  it 'allows to select a layer as highlighted', ->
    # This seems to be a problem with vuetify and checkboxes.
    # https://stackoverflow.com/questions/51286835/cypress-vuetify-checkbox-not-identified
    cy.get("#highlight-layer").parent().click()
    cy.get("#highlight-layer").should("be.enabled")