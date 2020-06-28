describe "Shape Layers", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Shape").click()

    cy.get(".shape-settings").click()

  it "is created", ->
    cy.contains("Shape")

  it "can be set to rectangle", ->
    cy.get(".shape-select").click()
    cy.contains("Rectangle").click()

  it "can be set to rounded rectangle", ->
    cy.get(".shape-select").click()
    cy.contains("Rounded Rectangle").click()

  it "can be set to ellipse", ->
    cy.get(".shape-select").click()
    cy.contains("Ellipse").click()

  # TODO:
  # - stroke presence
  # - stroke width
  # - stroke color
  # - fill presence
  # - fill color
