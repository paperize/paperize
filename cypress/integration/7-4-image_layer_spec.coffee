describe "Image Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Image").click()

  it 'works', ->
    cy.vuex().then (vuex) ->
      vuex.dispatch("createImage", { id: "real_id", name: "Guard Image" })

    cy.contains("Image Selection").click()
    cy.contains("Dynamic").click()
    cy.get(".image-name-suffix input").type(" Image")
    cy.get(".image-name-property").click()
    cy.contains("Name").click()
