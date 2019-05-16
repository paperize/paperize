describe "Layer Dimensions", ->
  beforeEach ->
    cy.loginAndEditGame()
    cy.get("#template-editor").within ->
      cy.contains("edit").click()

    cy.contains("library_add").click()
    cy.contains("Shape").click()
    cy.contains('Dimensions').click()

  it "let's me set inches as the unit of measure", ->
    cy.get("#dimension-unit-selector").within ->
      cy.contains('in').click()

    cy.get("#layout-xywh").within ->
      cy.contains('in')

  it "let's me set millimeters as the unit of measure", ->
    cy.get("#dimension-unit-selector").within ->
      cy.contains('mm').click()

    cy.get("#layout-xywh").within ->
      cy.contains('mm')

  it "let's me set pixels as the unit of measure", ->
    cy.get("#dimension-unit-selector").within ->
      cy.contains('px').click()

    cy.get("#layout-xywh").within ->
      cy.contains('px')

  it "let's me set percent as the unit of measure", ->
    cy.get("#dimension-unit-selector").within ->
      cy.contains('%').click()

    cy.get("#layout-xywh").within ->
      cy.contains('%')

  it "works with fast editing of values", ->
    cy.get("#dimension-editor").within ->
      cy.get("#dim-y").clear().type("20")
      cy.get("#dim-h").clear().type("40")
      cy.get("#dim-w").clear().type("30")
      cy.get("#dim-x").clear().type("10")

  it "let's me toggle between xywh and inset mode", ->
    cy.get("#dimension-editor").within ->
      # see the x/y/w/h percent values
      cy.get("#dim-x").invoke("val").should("eq", "5.0")
      cy.get("#dim-y").invoke("val").should("eq", "5.0")
      cy.get("#dim-w").invoke("val").should("eq", "90.0")
      cy.get("#dim-h").invoke("val").should("eq", "90.0")
      # click inset
      cy.contains("Inset").click()
      # see the t/r/b/l percent values
      cy.get("#dim-t").invoke("val").should("eq", "5.0")
      cy.get("#dim-r").invoke("val").should("eq", "5.0")
      cy.get("#dim-b").invoke("val").should("eq", "5.0")
      cy.get("#dim-l").invoke("val").should("eq", "5.0")
      # set them all to 10
      cy.get("#dim-t").clear().type("10")
      cy.get("#dim-r").clear().type("10")
      cy.get("#dim-b").clear().type("10")
      cy.get("#dim-l").clear().type("10")
      # click xywh
      cy.contains("XYWH").click()
      # see the x/y/w/h percent values
      cy.get("#dim-x").invoke("val").should("eq", "10.0")
      cy.get("#dim-y").invoke("val").should("eq", "10.0")
      cy.get("#dim-w").invoke("val").should("eq", "80.0")
      cy.get("#dim-h").invoke("val").should("eq", "80.0")
