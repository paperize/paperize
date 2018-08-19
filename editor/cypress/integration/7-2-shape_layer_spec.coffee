describe "Shape Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("Edit").click()

    cy.contains("New Layer").click()
    cy.contains("Shape").click()

  it "is created", ->
    cy.contains("[shape] 0")

  it "can be set to rectangle", ->
    cy.get(".shape-layer-fields select").select("Rectangle")

  it "can be set to rounded rectangle", ->
    cy.get(".shape-layer-fields select").select("Rounded Rectangle")

  it "can be set to ellipse", ->
    cy.get(".shape-layer-fields select").select("Ellipse")
